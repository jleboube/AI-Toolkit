import React from 'react';
import type { User, Page } from '../types';
import { GoogleIcon, HistoryIcon, LogoutIcon } from './IconComponents';

interface HeaderProps {
  user: User | null;
  currentPage: Page;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: (page: Page) => void;
  isAuthEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, currentPage, onSignIn, onSignOut, onNavigate, isAuthEnabled }) => {
  return (
    <header className="w-full max-w-4xl mx-auto text-center relative">
      {isAuthEnabled && (
        <div className="absolute top-0 right-0 flex items-center gap-2">
          {user ? (
            <div className="group relative">
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-600 cursor-pointer" />
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                <div className="p-2 border-b border-gray-600">
                  <p className="font-semibold text-white text-sm truncate">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>
                <button onClick={onSignOut} className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-900/50 flex items-center gap-2">
                  <LogoutIcon />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button onClick={onSignIn} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-sm transition-colors">
              <GoogleIcon />
              Sign in
            </button>
          )}
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Baseball Exit Velocity AI
      </h1>
      <div className="mt-2 flex items-center justify-center gap-4">
        <p className="text-lg text-gray-400">
          Estimate the speed of any hit using the power of Gemini.
        </p>
        {isAuthEnabled && user && (
            currentPage === 'analyzer' ? (
                <button onClick={() => onNavigate('history')} className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    <HistoryIcon /> View History
                </button>
            ) : (
                 <button onClick={() => onNavigate('analyzer')} className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    &larr; Back to Analyzer
                </button>
            )
        )}
      </div>
    </header>
  );
};