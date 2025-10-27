
import React from 'react';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  styles: HeadshotStyle[];
  selectedStyle: HeadshotStyle | null;
  onSelect: (style: HeadshotStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
            selectedStyle?.id === style.id
              ? 'border-cyan-500 bg-cyan-500/10 shadow-lg'
              : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700/50'
          }`}
        >
          <h3 className="font-semibold text-lg text-white">{style.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{style.description}</p>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
