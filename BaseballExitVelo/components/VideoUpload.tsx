
import React, { useState, useRef } from 'react';
import { AnalyzeIcon, VideoUploadIcon } from './IconComponents';

interface VideoUploadProps {
  onAnalyze: (frames: string[]) => void;
  isDisabled: boolean;
}

const FRAME_CAPTURE_COUNT = 4;
const FRAME_CAPTURE_INTERVAL_MS = 50; 

export const VideoUpload: React.FC<VideoUploadProps> = ({ onAnalyze, isDisabled }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    video.pause();
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const frames: string[] = [];
    let capturedCount = 0;
    const baseTime = video.currentTime - (FRAME_CAPTURE_COUNT / 2 * (FRAME_CAPTURE_INTERVAL_MS / 1000));
    
    const captureFrame = (time: number) => {
        return new Promise<string>(resolve => {
            const tempVideo = document.createElement('video');
            tempVideo.src = video.src;
            tempVideo.currentTime = Math.max(0, time);
            tempVideo.onseeked = () => {
                context.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };
    
    const captureSequence = async () => {
        for (let i = 0; i < FRAME_CAPTURE_COUNT; i++) {
            const captureTime = baseTime + (i * (FRAME_CAPTURE_INTERVAL_MS / 1000));
            const frame = await captureFrame(captureTime);
            frames.push(frame);
        }
        onAnalyze(frames);
    }
    
    captureSequence();
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner relative">
        {videoSrc ? (
          <video ref={videoRef} src={videoSrc} controls className="w-full h-full object-cover"></video>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
             <VideoUploadIcon className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-4">Select a video file to analyze.</p>
            <button onClick={triggerFileSelect} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors">
              Choose File
            </button>
          </div>
        )}
      </div>
      <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {videoSrc && (
        <button
          onClick={handleCapture}
          disabled={isDisabled}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform transform active:scale-95"
        >
          <AnalyzeIcon />
          {isDisabled ? 'Analyzing...' : 'Analyze Hit at Current Time'}
        </button>
      )}
    </div>
  );
};
