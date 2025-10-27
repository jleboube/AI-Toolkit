
import React, { useState } from 'react';
import type { ShortenedURL } from '../App';

interface URLListProps {
  urls: ShortenedURL[];
}

const ClipboardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const URLList: React.FC<URLListProps> = ({ urls }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (url: ShortenedURL) => {
        navigator.clipboard.writeText(url.shortUrl);
        setCopiedId(url.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (urls.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-white">Your Links</h2>
            {urls.map(url => (
                <div key={url.id} className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:bg-slate-700/50">
                    <div className="flex-1 overflow-hidden">
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-indigo-400 hover:underline break-words">
                            {url.shortUrl}
                        </a>
                        <p className="text-sm text-slate-400 truncate mt-1" title={url.longUrl}>
                            {url.longUrl}
                        </p>
                         <p className="text-xs text-slate-500 mt-2">
                           Created: {new Date(url.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-center">
                             <p className="text-lg font-bold text-white">{url.clicks}</p>
                             <p className="text-xs text-slate-500">CLICKS</p>
                        </div>
                        <button 
                            onClick={() => handleCopy(url)}
                            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 flex items-center gap-2 ${copiedId === url.id ? 'bg-green-600 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-200'}`}
                        >
                            {copiedId === url.id ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                            {copiedId === url.id ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default URLList;
