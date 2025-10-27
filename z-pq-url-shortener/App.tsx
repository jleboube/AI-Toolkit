
import React, { useCallback } from 'react';
import URLShortenerForm from './components/URLShortenerForm';
import URLList from './components/URLList';
import useLocalStorage from './hooks/useLocalStorage';

export interface ShortenedURL {
  id: string;
  longUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

const App: React.FC = () => {
  const [urls, setUrls] = useLocalStorage<ShortenedURL[]>('shortenedUrls', []);

  const generateShortCode = (length: number = 6): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShorten = useCallback((longUrl: string, customAlias?: string): void => {
    const shortCode = customAlias || generateShortCode();
    
    // Check for duplicate short codes
    if (urls.some(url => url.shortCode === shortCode)) {
      // In a real app, you'd handle this more gracefully,
      // e.g., by regenerating or showing an error for custom aliases.
      alert(`Alias "${shortCode}" is already taken!`);
      return;
    }

    const newUrl: ShortenedURL = {
      id: new Date().toISOString(),
      longUrl,
      shortCode,
      shortUrl: `https://z-pq.com/${shortCode}`,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    setUrls(prevUrls => [newUrl, ...prevUrls]);
  }, [urls, setUrls]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6">
      <header className="w-full max-w-4xl text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Z-PQ URL Shortener
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          The simpler, smarter way to shorten your links.
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <URLShortenerForm onShorten={handleShorten} />
        <div className="mt-12">
            {urls.length > 0 && <URLList urls={urls} />}
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center mt-auto pt-8">
        <p className="text-slate-500">A frontend demo built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
