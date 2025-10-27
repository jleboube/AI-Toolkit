import React, { useState } from 'react';
import { suggestAlias } from '../services/geminiService';

interface URLShortenerFormProps {
  onShorten: (longUrl: string, customAlias?: string) => void;
}

const MagicWandIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.587 2.072a.5.5 0 01.826 0l1.43 2.144a.5.5 0 00.383.272l2.404.219a.5.5 0 01.28.852l-1.823 1.581a.5.5 0 00-.148.465l.53 2.34a.5.5 0 01-.74.542l-2.07-1.281a.5.5 0 00-.488 0l-2.07 1.281a.5.5 0 01-.74-.542l.53-2.34a.5.5 0 00-.148-.465L3.3 5.559a.5.5 0 01.28-.852l2.404-.219a.5.5 0 00.384-.272l1.429-2.144zM5 13.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM3.5 16a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM19.5 13a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM18 16.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM13 5.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM10.5 8a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM15.5 8a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM12 11.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
    </svg>
);


const URLShortenerForm: React.FC<URLShortenerFormProps> = ({ onShorten }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }
    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      onShorten(longUrl, customAlias);
      setLongUrl('');
      setCustomAlias('');
      setIsLoading(false);
    }, 500);
  };
  
  const handleSuggestAlias = async () => {
    if (!longUrl) {
      setError('Please enter a long URL first to get a suggestion.');
      return;
    }
    if (!isValidUrl(longUrl)) {
      setError('The entered URL is not valid.');
      return;
    }

    setError('');
    setIsSuggesting(true);
    try {
        const alias = await suggestAlias(longUrl);
        setCustomAlias(alias);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsSuggesting(false);
    }
  }

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="longUrl" className="sr-only">Long URL</label>
          <input
            id="longUrl"
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter a long URL to shorten..."
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
                <label htmlFor="customAlias" className="sr-only">Custom Alias (Optional)</label>
                <div className="flex items-center bg-slate-700 border-2 border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition duration-200">
                    <span className="text-slate-400 pl-4 pr-2 py-3 flex-shrink-0">z-pq.com/</span>
                    <input
                        id="customAlias"
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="custom-alias"
                        className="flex-1 pl-2 pr-4 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                    />
                </div>
            </div>
            <button 
                type="button" 
                onClick={handleSuggestAlias}
                disabled={isSuggesting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSuggesting ? (
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <MagicWandIcon className="w-5 h-5"/>
                )}
                Suggest with AI
            </button>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default URLShortenerForm;