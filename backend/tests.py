import cv2
from process_video import extract_frames
from process_video import detect_people


VIDEO_PATH = "../prithikaa_hackathon.mov"

frames = extract_frames(VIDEO_PATH)

for timestamp, frame in frames[:5]:  # test first 5 frames
    people = detect_people(frame)

    for p in people:
        cv2.circle(
            frame,
            (int(p["x"]), int(p["y"])),
            4,
            (255, 0, 0),
            -1
        )

    cv2.imshow(f"Frame @ {timestamp:.2f}s", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    cv2.waitKey(0)

cv2.destroyAllWindows()
