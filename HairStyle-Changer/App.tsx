import React, { useState, useCallback } from 'react';
import { Hairstyle } from './types';
import { HAIRSTYLES } from './constants';
import { applyHairstyle, ViewAngle, generateRandomHairstylePrompt, suggestHairstyle } from './services/geminiService';
import CameraCapture from './components/CameraCapture';
import HairstyleSelector from './components/HairstyleSelector';
import ViewSelector from './components/ViewSelector';
import Loader from './components/Loader';
import { CameraIcon } from './components/icons/CameraIcon';
import { UploadIcon } from './components/icons/UploadIcon';
import { ResetIcon } from './components/icons/ResetIcon';
import AIStylist from './components/AIStylist';

type AppState = 'initial' | 'capture' | 'editing';

// Helper to generate image URLs from prompts for the random style
const createImageUrl = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt + ', realistic, portrait photo');
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=200&height=200&nologo=true`;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initial');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [currentView, setCurrentView] = useState<ViewAngle>('front');
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ prompt: string; reason: string; } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // State to cache generated images: { [hairstyleId]: { front: '...', side: '...' } }
  const [cachedImages, setCachedImages] = useState<Record<string, Partial<Record<ViewAngle, string>>>>({});
  // State to track loading status for each view: { [hairstyleId]: { front: true, side: false } }
  const [loadingStates, setLoadingStates] = useState<Record<string, Partial<Record<ViewAngle, boolean>>>>({});


  const handleImageReady = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setAppState('editing');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageReady(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHairstyleSelect = useCallback((hairstyle: Hairstyle) => {
    setSelectedHairstyle(hairstyle);
    setCurrentView('front');
    setError(null);

    // If this hairstyle has already been processed (or is in process), don't start again.
    if (cachedImages[hairstyle.id] || loadingStates[hairstyle.id]) {
      return;
    }

    // This function will generate all views sequentially in the background.
    const generateSequence = async () => {
      if (!originalImage) return;
      const viewsToGenerate: ViewAngle[] = ['front', 'side', 'back'];

      for (const view of viewsToGenerate) {
        // Set loading state for the specific view
        setLoadingStates(prev => ({
          ...prev,
          [hairstyle.id]: { ...prev[hairstyle.id], [view]: true },
        }));

        try {
          const newImage = await applyHairstyle(originalImage, hairstyle.promptDescription, view);
          
          // Cache the resulting image
          setCachedImages(prev => ({
            ...prev,
            [hairstyle.id]: { ...prev[hairstyle.id], [view]: newImage },
          }));
        } catch (err) {
          console.error(`Failed to generate ${view} view for ${hairstyle.name}:`, err);
          if (view === 'front') {
            setError(`Failed to generate the primary view for ${hairstyle.name}. Please try another style or photo.`);
          }
          // If a view fails, stop the sequence for this hairstyle.
          break;
        } finally {
          // Unset loading state for the specific view
          setLoadingStates(prev => ({
            ...prev,
            [hairstyle.id]: { ...prev[hairstyle.id], [view]: false },
          }));
        }
      }
    };

    generateSequence();
  }, [originalImage, cachedImages, loadingStates]);

  const handleGenerateRandom = useCallback(async () => {
    setError(null);
    setIsGeneratingRandom(true);
    try {
        const existingPrompts = HAIRSTYLES.map(h => h.promptDescription);
        const newPrompt = await generateRandomHairstylePrompt(existingPrompts);
        
        const randomStyle: Hairstyle = {
            id: `random-${Date.now()}`,
            name: 'Surprise Me!',
            promptDescription: newPrompt,
            imageUrl: createImageUrl(newPrompt), // For a potential thumbnail
            gender: 'unisex',
        };
        handleHairstyleSelect(randomStyle);

    } catch (err) {
        console.error("Failed to generate random hairstyle prompt:", err);
        setError("Could not generate a random style. Please try again.");
    } finally {
        setIsGeneratingRandom(false);
    }
  }, [handleHairstyleSelect]);

  const handleSuggestHairstyle = useCallback(async () => {
    if (!originalImage) return;
    setError(null);
    setAiSuggestion(null);
    setIsSuggesting(true);
    try {
        const suggestion = await suggestHairstyle(originalImage);
        setAiSuggestion(suggestion);
    } catch (err) {
        console.error("Failed to get AI suggestion:", err);
        setError("The AI Stylist is busy. Please try again later.");
    } finally {
        setIsSuggesting(false);
    }
  }, [originalImage]);

  const handleTryOnSuggestion = useCallback(() => {
    if (!aiSuggestion) return;
    
    const suggestedStyle: Hairstyle = {
        id: `suggested-${Date.now()}`,
        name: 'AI Suggestion',
        promptDescription: aiSuggestion.prompt,
        imageUrl: createImageUrl(aiSuggestion.prompt), // For a potential thumbnail
        gender: 'unisex',
    };
    handleHairstyleSelect(suggestedStyle);
  }, [aiSuggestion, handleHairstyleSelect]);


  const handleViewSelect = useCallback((view: ViewAngle) => {
    if (!selectedHairstyle) return;
    // Simply update the current view. The rendering logic will find the cached image or show a loader.
    setCurrentView(view);
  }, [selectedHairstyle]);


  const resetApp = () => {
    setAppState('initial');
    setOriginalImage(null);
    setSelectedHairstyle(null);
    setCurrentView('front');
    setError(null);
    setCachedImages({});
    setLoadingStates({});
    setIsGeneratingRandom(false);
    setAiSuggestion(null);
    setIsSuggesting(false);
  };

  const handleFindSalon = () => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const mapsUrl = `https://www.google.com/maps/search/hair+salon/@${latitude},${longitude},14z`;
            window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        },
        () => {
            setError("Unable to retrieve your location. Please enable location services in your browser's settings.");
        }
    );
  };

  const handleBookOnBooksy = () => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const booksyUrl = `https://booksy.com/en-us/s/hair-salon?geopicker_lat=${latitude}&geopicker_lng=${longitude}`;
            window.open(booksyUrl, '_blank', 'noopener,noreferrer');
        },
        () => {
            setError("Unable to retrieve your location. Please enable location services in your browser's settings.");
        }
    );
  };

  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">Welcome to HairDid.store</h1>
        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Use our AI Hairstyle Try-On</h2>
        <p className="text-lg text-gray-400">Find your next look in seconds. Upload a photo or use your camera.  Then find a salon and book.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => setAppState('capture')}
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          <CameraIcon />
          Use Camera
        </button>
        <label className="group cursor-pointer flex items-center justify-center gap-3 px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500">
          <UploadIcon />
          Upload Photo
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );

  const renderCaptureState = () => (
    <CameraCapture onCapture={handleImageReady} onBack={() => setAppState('initial')} />
  );

  const renderEditingState = () => {
    const currentHairstyleId = selectedHairstyle?.id;
    const currentLoadingStates = currentHairstyleId ? loadingStates[currentHairstyleId] : {};
    const cachedViewsForSelectedStyle = currentHairstyleId ? cachedImages[currentHairstyleId] : {};
    const imageToShow = currentHairstyleId ? cachedImages[currentHairstyleId]?.[currentView] : null;
    const isCurrentViewLoading = currentLoadingStates?.[currentView] === true;
    const isAnyViewLoadingForSelected = Object.values(currentLoadingStates ?? {}).some(Boolean);
    const areAllViewsGeneratedForSelectedStyle = !!selectedHairstyle && ['front', 'side', 'back'].every(view => cachedViewsForSelectedStyle?.[view as ViewAngle]);

    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Virtual Makeover</h1>
          <button onClick={resetApp} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
            <ResetIcon />
            Start Over
          </button>
        </header>
        {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4 w-full max-w-4xl text-center">{error}</div>}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-300">Original</h2>
                {originalImage && <img src={originalImage} alt="Original" className="rounded-xl shadow-lg w-full object-cover aspect-square" />}
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-300">New Look</h2>
                <div className="w-full aspect-square bg-gray-700 rounded-xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                  {isCurrentViewLoading && <Loader />}
                  {imageToShow && !isCurrentViewLoading && <img src={imageToShow} alt="Modified" className="w-full h-full object-cover" />}
                  {!imageToShow && !isCurrentViewLoading && (
                     <div className="text-gray-400 p-4 text-center">
                        {selectedHairstyle ? `Generating ${selectedHairstyle.name} (${currentView} view)...` : 'Select a hairstyle to see the magic happen!'}
                     </div>
                  )}
                </div>
              </div>
            </div>
            {selectedHairstyle && (
              <ViewSelector
                currentView={currentView}
                onSelectView={handleViewSelect}
                loadingStates={currentLoadingStates}
                cachedViews={cachedViewsForSelectedStyle}
                areAllViewsGenerated={areAllViewsGeneratedForSelectedStyle}
                onFindSalon={handleFindSalon}
                onBookOnBooksy={handleBookOnBooksy}
              />
            )}
          </div>
        </div>
        <AIStylist
          onSuggest={handleSuggestHairstyle}
          isSuggesting={isSuggesting}
          suggestion={aiSuggestion}
          onTrySuggestion={handleTryOnSuggestion}
          isDisabled={isAnyViewLoadingForSelected || isGeneratingRandom}
        />
        <div className="w-full max-w-6xl mt-8">
          <HairstyleSelector
            hairstyles={HAIRSTYLES}
            selectedHairstyle={selectedHairstyle}
            onSelect={handleHairstyleSelect}
            onGenerateRandom={handleGenerateRandom}
            isGeneratingRandom={isGeneratingRandom}
            isDisabled={isAnyViewLoadingForSelected || isGeneratingRandom || isSuggesting}
          />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (appState) {
      case 'initial':
        return renderInitialState();
      case 'capture':
        return renderCaptureState();
      case 'editing':
        return renderEditingState();
      default:
        return renderInitialState();
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default App;