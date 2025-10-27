import React from 'react';
import { Hairstyle } from '../types';
import { MaleIcon } from './icons/MaleIcon';
import { FemaleIcon } from './icons/FemaleIcon';
import ImageWithLoader from './ImageWithLoader';
import { ShuffleIcon } from './icons/ShuffleIcon';

interface HairstyleSelectorProps {
  hairstyles: Hairstyle[];
  selectedHairstyle: Hairstyle | null;
  onSelect: (hairstyle: Hairstyle) => void;
  onGenerateRandom: () => void;
  isGeneratingRandom: boolean;
  isDisabled: boolean;
}

const HairstyleSelector: React.FC<HairstyleSelectorProps> = ({
  hairstyles,
  selectedHairstyle,
  onSelect,
  onGenerateRandom,
  isGeneratingRandom,
  isDisabled,
}) => {
  const isRandomSelected = selectedHairstyle?.id.startsWith('random');
  return (
    <div className="bg-gray-900/50 p-4 rounded-xl backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Choose a Style</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
        {hairstyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            disabled={isDisabled}
            className={`relative flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-transparent ${
              selectedHairstyle?.id === style.id ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-gray-700 hover:bg-indigo-500 focus:ring-indigo-500'
            } ${isDisabled && selectedHairstyle?.id !== style.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-pressed={selectedHairstyle?.id === style.id}
          >
            <div className="relative">
                <ImageWithLoader src={style.imageUrl} alt={style.name} className="w-24 h-24" />
                {(style.gender === 'male' || style.gender === 'female') && (
                    <div className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 flex items-center justify-center">
                        {style.gender === 'male' && <MaleIcon />}
                        {style.gender === 'female' && <FemaleIcon />}
                    </div>
                )}
            </div>
            <span className="text-sm text-center text-white font-medium">{style.name}</span>
          </button>
        ))}
        {/* Random Style Button */}
        <button
          onClick={onGenerateRandom}
          disabled={isDisabled}
          className={`relative flex flex-col items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-transparent w-full h-full min-h-[140px] ${
            isRandomSelected ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-purple-500 focus:ring-purple-500'
          } ${isDisabled && !isRandomSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-pressed={isRandomSelected}
        >
          <div className="w-24 h-24 flex items-center justify-center">
            {isGeneratingRandom ? (
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
            ) : (
              <ShuffleIcon className="w-12 h-12 text-white" />
            )}
          </div>
          <span className="text-sm text-center text-white font-medium">Surprise Me!</span>
        </button>
      </div>
    </div>
  );
};

export default HairstyleSelector;