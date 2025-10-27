
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onBack: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream;
    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check your browser permissions.");
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-6 relative">
        <h2 className="text-2xl font-bold text-center mb-4">Live Camera</h2>
        {error ? (
          <div className="aspect-video bg-black flex items-center justify-center rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-video rounded-lg bg-black" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center items-center mt-6 gap-4">
          <button onClick={onBack} className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">Back</button>
          <button
            onClick={handleCapture}
            disabled={!stream}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <CameraIcon />
            Take Picture
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
