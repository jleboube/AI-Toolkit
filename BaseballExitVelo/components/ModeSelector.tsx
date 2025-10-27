
import React from 'react';
import type { AppMode } from '../types';
import { CameraIcon, VideoUploadIcon } from './IconComponents';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const baseClasses = "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500";
  const activeClasses = "bg-blue-600 text-white shadow-md";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="flex bg-gray-900/50 p-1 rounded-t-2xl">
      <button
        onClick={() => onModeChange('camera')}
        className={`${baseClasses} rounded-tl-xl rounded-bl-xl ${currentMode === 'camera' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentMode === 'camera'}
      >
        <CameraIcon />
        Live Camera
      </button>
      <button
        onClick={() => onModeChange('upload')}
        className={`${baseClasses} rounded-tr-xl rounded-br-xl ${currentMode === 'upload' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentMode === 'upload'}
      >
        <VideoUploadIcon />
        Upload Video
      </button>
    </div>
  );
};
