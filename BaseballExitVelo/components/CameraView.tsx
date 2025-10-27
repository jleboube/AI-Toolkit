
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnalyzeIcon } from './IconComponents';

interface CameraViewProps {
  onAnalyze: (frames: string[]) => void;
  isDisabled: boolean;
}

const FRAME_CAPTURE_COUNT = 4;
const FRAME_CAPTURE_INTERVAL_MS = 50; // Capture 4 frames over ~150ms

export const CameraView: React.FC<CameraViewProps> = ({ onAnalyze, isDisabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again.");
      setIsCameraOn(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const frames: string[] = [];
    let capturedCount = 0;

    const intervalId = setInterval(() => {
      if (capturedCount >= FRAME_CAPTURE_COUNT) {
        clearInterval(intervalId);
        onAnalyze(frames);
        return;
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      frames.push(frameDataUrl);
      capturedCount++;

    }, FRAME_CAPTURE_INTERVAL_MS);
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
        {!isCameraOn && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Starting camera...</div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {error && (
        <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-center">
            <p>{error}</p>
            <button onClick={startCamera} className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-md text-white font-semibold">Retry</button>
        </div>
      )}

      {isCameraOn && (
        <button
          onClick={handleCapture}
          disabled={isDisabled}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform transform active:scale-95"
        >
          <AnalyzeIcon />
          {isDisabled ? 'Analyzing...' : 'Analyze Hit'}
        </button>
      )}
    </div>
  );
};
