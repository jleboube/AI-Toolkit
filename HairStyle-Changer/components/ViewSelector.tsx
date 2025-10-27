import React from 'react';
import { ViewAngle } from '../services/geminiService';
import { MapPinIcon } from './icons/MapPinIcon';
import { BookIcon } from './icons/BookIcon';

interface ViewSelectorProps {
  currentView: ViewAngle;
  onSelectView: (view: ViewAngle) => void;
  loadingStates?: Partial<Record<ViewAngle, boolean>>;
  cachedViews?: Partial<Record<ViewAngle, string>>;
  areAllViewsGenerated?: boolean;
  onFindSalon?: () => void;
  onBookOnBooksy?: () => void;
}

const VIEWS: { id: ViewAngle; label: string }[] = [
  { id: 'front', label: 'Front View' },
  { id: 'side', label: 'Side View' },
  { id: 'back', label: 'Back View' },
];

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onSelectView, loadingStates = {}, cachedViews = {}, areAllViewsGenerated, onFindSalon, onBookOnBooksy }) => {
  return (
    <div className="mt-4 w-full max-w-4xl flex flex-col gap-2">
      <div className="bg-gray-700/50 p-2 rounded-lg flex justify-center items-center gap-2 flex-wrap">
        {VIEWS.map((view) => {
          const isLoading = loadingStates[view.id] === true;
          const isAvailable = !!cachedViews[view.id];
          const isSelected = currentView === view.id;
          const isDisabled = isLoading || !isAvailable;

          return (
            <button
              key={view.id}
              onClick={() => onSelectView(view.id)}
              disabled={isDisabled}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2 min-w-[120px] h-10 ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              } ${!isDisabled && !isSelected ? 'hover:bg-gray-500' : ''
              } ${isLoading ? 'cursor-wait' : ''
              } ${!isAvailable && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
              ) : (
                view.label
              )}
            </button>
          );
        })}
      </div>
      {areAllViewsGenerated && (
        <div className="bg-gray-700/50 p-2 rounded-lg flex justify-center items-center gap-2 flex-wrap">
          <button
              onClick={onFindSalon}
              className="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 h-10 bg-emerald-600 text-white hover:bg-emerald-500 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
          >
              <MapPinIcon />
              Find on Google Maps
          </button>
          <button
              onClick={onBookOnBooksy}
              className="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 h-10 bg-sky-600 text-white hover:bg-sky-500 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500"
          >
              <BookIcon />
              Book on Booksy
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewSelector;