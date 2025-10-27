import React, { useState } from 'react';
import Spinner from './Spinner';
import StyleSelector from './StyleSelector';
import ImageComparator from './ImageComparator';
import { HeadshotStyle } from '../types';

interface GeneratedImageDisplayProps {
  imageUrl: string;
  previousImageUrl: string | null;
  onEdit: (prompt: string) => void;
  isEditing: boolean;
  isGeneratingStyle: boolean;
  onStartOver: () => void;
  styles: HeadshotStyle[];
  selectedStyle: HeadshotStyle | null;
  onSelectStyle: (style: HeadshotStyle) => void;
}

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  imageUrl,
  previousImageUrl,
  onEdit,
  isEditing,
  isGeneratingStyle,
  onStartOver,
  styles,
  selectedStyle,
  onSelectStyle,
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const isBusy = isEditing || isGeneratingStyle;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim() && !isBusy) {
      onEdit(editPrompt);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ai-headshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-4xl font-bold mb-6 text-cyan-400">Your AI Headshot is Ready!</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6 w-full">
          <div className="relative">
            {previousImageUrl && !isGeneratingStyle ? (
              <ImageComparator beforeImageUrl={previousImageUrl} afterImageUrl={imageUrl} />
            ) : (
              <img src={imageUrl} alt="Generated headshot" className="rounded-lg shadow-2xl mx-auto w-full max-w-md object-contain" />
            )}

            {isBusy && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg transition-opacity duration-300">
                <Spinner />
              </div>
            )}
          </div>
          <div className={`text-left transition-opacity duration-300 ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-xl font-semibold mb-4 text-white">Try a Different Style</h3>
            <StyleSelector
              styles={styles}
              selectedStyle={selectedStyle}
              onSelect={onSelectStyle}
            />
          </div>
        </div>

        <div className="text-left bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white">Refine Your Image</h3>
          <p className="text-gray-400 mb-4">
            Use simple text prompts to make changes. For example: "Give me a slightly warmer smile", "Change the background to a library", or "Add a retro filter".
          </p>
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="e.g., Make the background blue..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-white placeholder-gray-400"
              rows={3}
              disabled={isBusy}
            />
            <button
              type="submit"
              disabled={isBusy || !editPrompt.trim()}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {isEditing ? <Spinner /> : 'Apply Edit'}
            </button>
          </form>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              disabled={isBusy}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </button>
            <button
              onClick={onStartOver}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImageDisplay;