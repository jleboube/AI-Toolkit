import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIStylistProps {
  onSuggest: () => void;
  isSuggesting: boolean;
  suggestion: { prompt: string; reason:string; } | null;
  onTrySuggestion: () => void;
  isDisabled: boolean;
}

const AIStylist: React.FC<AIStylistProps> = ({ onSuggest, isSuggesting, suggestion, onTrySuggestion, isDisabled }) => {
  return (
    <div className="w-full max-w-6xl mt-8 bg-gray-900/50 p-4 rounded-xl backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">AI Stylist</h3>
        <div className="flex flex-col items-center gap-4">
            {!suggestion && (
                <button 
                    onClick={onSuggest} 
                    disabled={isSuggesting || isDisabled}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-fuchsia-600 text-white font-semibold rounded-lg shadow-lg hover:bg-fuchsia-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isSuggesting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            Thinking...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Suggest a Style For Me
                        </>
                    )}
                </button>
            )}

            {suggestion && !isSuggesting && (
                <div className="bg-gray-700 p-4 rounded-lg text-center w-full max-w-2xl">
                    <p className="text-gray-300 mb-1">Our AI Stylist suggests:</p>
                    <p className="text-lg font-bold text-white capitalize mb-2">"{suggestion.prompt}"</p>
                    <p className="text-sm text-gray-400 italic mb-4">"{suggestion.reason}"</p>
                    <button 
                        onClick={onTrySuggestion} 
                        disabled={isDisabled}
                        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Try It On!
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default AIStylist;
