import React from 'react';
import { Toaster } from "sonner";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 263 70% 50%;
          --primary-foreground: 210 40% 98%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 263 70% 50%;
        }
        
        body {
          background: #0a0a1a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        
        /* Leaflet overrides */
        .leaflet-container {
          background: #0a0a1a;
          font-family: inherit;
        }
        
        .leaflet-popup-content-wrapper {
          background: rgba(15, 15, 30, 0.95);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
        }
        
        .leaflet-popup-content {
          color: white;
          margin: 12px 16px;
        }
        
        .leaflet-popup-tip {
          background: rgba(15, 15, 30, 0.95);
        }
        
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.6) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 10px;
        }
        
        .leaflet-control-attribution a {
          color: rgba(139, 92, 246, 0.8) !important;
        }
        
        /* Animation for pulsing markers */
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .pulse-ring {
          animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}</style>
      
      {children}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 30, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}