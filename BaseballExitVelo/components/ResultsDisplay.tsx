
import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const velocityValue = parseFloat(result.exitVelocity);
  const isNumericVelocity = !isNaN(velocityValue);

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-blue-300 mb-4">Analysis Complete</h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <p className="text-lg text-gray-400 uppercase tracking-wider">Exit Velocity</p>
          <p className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
            {isNumericVelocity ? velocityValue.toFixed(1) : result.exitVelocity}
          </p>
          <p className="text-2xl font-semibold text-gray-400">MPH</p>
        </div>
        <div className="w-full sm:w-px h-px sm:h-24 bg-gray-600 my-4 sm:my-0"></div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-300 mb-1">AI Analyst Notes</h3>
          <p className="text-gray-400 italic">"{result.analysis}"</p>
        </div>
      </div>
    </div>
  );
};
