import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { CameraView } from './components/CameraView';
import { VideoUpload } from './components/VideoUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { Instructions } from './components/Instructions';
import { History } from './components/History';
import { analyzeHit } from './services/geminiService';
import type { AnalysisResult, AppMode, User, Page, AnalysisHistoryItem } from './types';

// A simple helper to decode JWT tokens without external libraries
function decodeJwtResponse(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

type AuthStatus = 'pending' | 'enabled' | 'disabled';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('camera');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('analyzer');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('pending');

  useEffect(() => {
    // Poll to check for the environment config, as env.js loads asynchronously.
    const checkAuthConfig = () => {
      if (typeof window.process === 'undefined') {
        return false; // Not ready to check
      }

      const clientId = window.process.env.GOOGLE_CLIENT_ID;
      // Check if clientId is defined, not empty, and not the placeholder value.
      if (clientId && clientId.length > 0 && !clientId.startsWith('your_google_oauth_client_id')) {
        setAuthStatus('enabled');
      } else {
        setAuthStatus('disabled');
      }
      return true; // Check complete
    };

    if (authStatus === 'pending') {
      const intervalId = setInterval(() => {
        if (checkAuthConfig()) {
          clearInterval(intervalId);
        }
      }, 100);

      // Timeout to prevent infinite polling
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        if (authStatus === 'pending') {
          console.warn("Could not find environment configuration. Disabling authentication features.");
          setAuthStatus('disabled');
        }
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [authStatus]);


  const handleCredentialResponse = useCallback((response: any) => {
    const userObject = decodeJwtResponse(response.credential);
    if (!userObject) {
      setError("Failed to process sign-in. Please try again.");
      return;
    }

    const authenticatedUser: User = {
      id: userObject.sub,
      name: userObject.name,
      email: userObject.email,
      picture: userObject.picture,
    };
    
    localStorage.setItem('velocity-ai-user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    
    // Load history for the new user
    const savedHistory = localStorage.getItem(`velocity-ai-history-${authenticatedUser.id}`);
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);
  }, []);

  useEffect(() => {
    if (authStatus !== 'enabled') {
      // If auth is not enabled, ensure user is logged out and history is cleared.
      localStorage.removeItem('velocity-ai-user');
      setUser(null);
      setHistory([]);
      return;
    }

    // Auth is enabled, proceed with initialization
    const savedUser = localStorage.getItem('velocity-ai-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const savedHistory = localStorage.getItem(`velocity-ai-history-${parsedUser.id}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }

    const initializeGsi = () => {
      if (window.google?.accounts?.id && window.process?.env?.GOOGLE_CLIENT_ID) {
        try {
            window.google.accounts.id.initialize({
                client_id: window.process.env.GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            return true;
        } catch (error) {
            console.error("Error initializing Google Sign-In:", error);
            setError("Could not initialize Google Sign-In.");
            return true;
        }
      }
      return false;
    };
    
    if (!initializeGsi()) {
        const intervalId = setInterval(() => {
            if (initializeGsi()) {
                clearInterval(intervalId);
            }
        }, 200);

        return () => clearInterval(intervalId);
    }
  }, [authStatus, handleCredentialResponse]);

  const handleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError("Google Sign-In is not ready. Please try again in a moment.");
    }
  };

  const handleSignOut = () => {
    if (user) {
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('velocity-ai-user');
    setUser(null);
    setHistory([]);
    setPage('analyzer');
  };

  const handleAnalysis = useCallback(async (frames: string[]) => {
    if (frames.length === 0) {
      setError("No frames were captured to analyze.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeHit(frames);
      setResult(analysisResult);
      
      // Only save history if a user is logged in (which requires auth to be enabled)
      if (user) {
        const newHistoryItem: AnalysisHistoryItem = {
          ...analysisResult,
          id: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        };
        setHistory(prevHistory => {
            const updatedHistory = [newHistoryItem, ...prevHistory];
            localStorage.setItem(`velocity-ai-history-${user.id}`, JSON.stringify(updatedHistory));
            return updatedHistory;
        });
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  if (showInstructions) {
    return <Instructions onStart={() => setShowInstructions(false)} />;
  }

  const isAuthEnabled = authStatus === 'enabled';

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 font-sans">
      <Header 
        user={user}
        currentPage={page}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNavigate={setPage}
        isAuthEnabled={isAuthEnabled}
      />
      <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mt-6">
        {page === 'analyzer' || !isAuthEnabled ? (
          <>
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
            <div className="p-4 sm:p-6">
              {mode === 'camera' ? (
                <CameraView onAnalyze={handleAnalysis} isDisabled={isLoading} />
              ) : (
                <VideoUpload onAnalyze={handleAnalysis} isDisabled={isLoading} />
              )}

              {isLoading && <Loader />}
              
              {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                  <p className="font-bold">Action Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {result && !isLoading && <ResultsDisplay result={result} />}
            </div>
          </>
        ) : (
          <History history={history} />
        )}
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Baseball Exit Velocity AI. For entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default App;