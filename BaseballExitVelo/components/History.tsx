import React from 'react';
import type { AnalysisHistoryItem } from '../types';
import { HistoryIcon } from './IconComponents';

interface HistoryProps {
  history: AnalysisHistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-center text-blue-300 mb-6">Analysis History</h2>
      {history.length === 0 ? (
        <div className="text-center py-12">
            <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">No History Found</h3>
            <p className="text-gray-500 mt-1">Analyze a hit while signed in to save it here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {history.map(item => (
                <div key={item.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg shadow-md animate-fade-in">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-400">
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                            <p className="text-3xl font-bold text-teal-300">
                                {parseFloat(item.exitVelocity).toFixed(1)} <span className="text-lg text-gray-400">MPH</span>
                            </p>
                        </div>
                    </div>
                     <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-sm text-gray-300 italic">"{item.analysis}"</p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
