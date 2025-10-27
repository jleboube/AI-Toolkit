
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>
      <span className="text-gray-300 ml-2">Thinking...</span>
    </div>
  );
};

export default LoadingSpinner;
