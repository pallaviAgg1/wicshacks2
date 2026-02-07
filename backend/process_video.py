# Video extraction 

import cv2
import os
from ultralytics import YOLO
import json


x1, y1 = 200, 300   # top-left corner of ROI
x2, y2 = 1720, 900  # bottom-right



VIDEO_PATH = "../prithikaa_hackathon.mov"
lat_min, lon_min = 30.268290, -97.776875
lat_max, lon_max = 30.265068, -97.765652
frame_width = 1920
frame_height = 1080

def extract_frames(video_path): 
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened(): 
        #some error or something, video didn't open

        return
    
    # Density information 
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps


    target_fps = 2 #change as needed for movement
    sample_break = max(1, int(fps / target_fps))

    frames = [] #Array of detections 
    idx = 0

   

    

    while True:
        ret, frame = cap.read()
        if not ret:
            break


        if idx % sample_break == 0:
            timestamp = idx / fps
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = frame[y1:y2, x1:x2]
            frame = cv2.resize(frame, (1280, 720))
            frames.append((timestamp, frame))

        idx += 1
            


    

    cap.release()


    
    return frames


def detect_people(frame, conf = 0.05):
    model = YOLO("yolov8s.pt")

    results = model(frame, conf=conf)[0] #run the model on the frame

    # Pinpoint all the people in this frame
    people = []
    for box in results.boxes:
        cls = int(box.cls[0])
        if cls != 0:
            continue

        x1, y1, x2, y2 = box.xyxy[0]
        cx = float((x1 + x2) / 2)
        cy = float((y1 + y2) / 2)

        people.append({"x": cx, "y": cy})
        
    


    return people


frames = extract_frames(VIDEO_PATH)

detections = []
for timestamp, frame in frames:
    people = detect_people(frame)

    people_full = []
    for p in people:
        cx_full = p["x"] + x1
        cy_full = p["y"] + y1

        # do the gps mapping

        lat = lat_min + (cy_full / frame_height) * (lat_max - lat_min)
        lon = lon_min + (cx_full / frame_width) * (lon_max - lon_min)
        people_full.append({"x": cx_full, "y": cy_full, "lat": lat, "lon": lon})


    detections.append({
        "timestamp": timestamp,
        "people": people_full
    })


# Group data by time for dynamic heatmap - 1 second intervals
interval = 1.0  # seconds
time_buckets = {}

for frame in detections:
    bucket = int(frame["timestamp"] // interval)
    if bucket not in time_buckets:
        time_buckets[bucket] = []
    for p in frame["people"]:
        time_buckets[bucket].append({"lat": p["lat"], "lon": p["lon"], "weight": 1})

with open("../src/detections.json", "w") as f:
    json.dump(time_buckets, f, indent=2)






