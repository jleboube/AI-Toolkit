
import React from 'react';
import { CameraIcon, VideoUploadIcon } from './IconComponents';

interface InstructionsProps {
  onStart: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
          Welcome to Velocity AI
        </h1>
        <p className="text-gray-400 mb-8">
          Get AI-powered estimates of baseball exit velocity. For best results, follow these tips:
        </p>
        
        <div className="space-y-6 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-900/50 rounded-full text-blue-300 font-bold">1</div>
            <div>
              <h3 className="font-bold text-lg text-white">Clear View of Impact</h3>
              <p className="text-gray-400">Ensure the batter, ball, and point of contact are clearly visible.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-900/50 rounded-full text-blue-300 font-bold">2</div>
            <div>
              <h3 className="font-bold text-lg text-white">Stable Camera</h3>
              <p className="text-gray-400">Keep the camera as steady as possible during the swing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-900/50 rounded-full text-blue-300 font-bold">3</div>
            <div>
              <h3 className="font-bold text-lg text-white">Good Lighting</h3>
              <p className="text-gray-400">Well-lit scenes produce more accurate analysis.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onStart} 
          className="mt-10 w-full px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-500 transition-transform transform active:scale-95"
        >
          Got It, Let's Go!
        </button>
      </div>
    </div>
  );
};
