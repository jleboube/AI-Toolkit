
import React from 'react';

export const Loader: React.FC = () => (
  <div className="mt-6 flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-lg">
    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg text-gray-300 font-semibold animate-pulse">AI is analyzing the hit...</p>
    <p className="text-sm text-gray-500">This may take a moment.</p>
  </div>
);
