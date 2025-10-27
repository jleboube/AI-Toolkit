import React, { useState, useCallback, useEffect } from 'react';
import { AppState, HeadshotStyle } from './types';
import { HEADSHOT_STYLES } from './constants';
import { generateHeadshot, editImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [previousGeneratedImage, setPreviousGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<HeadshotStyle | null>(null);


  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setAppState(AppState.IMAGE_UPLOADED);
    setError(null);
    setGeneratedImage(null);
    setPreviousGeneratedImage(null);
    setSelectedStyle(HEADSHOT_STYLES[0]);
  };

  const handleStyleSelect = (style: HeadshotStyle) => {
    setSelectedStyle(style);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage || !selectedStyle) return;
    
    // If we're re-generating from a result, store the current image as the previous one
    if (appState === AppState.RESULT_READY && generatedImage) {
        setPreviousGeneratedImage(generatedImage);
    } else {
        setPreviousGeneratedImage(null);
    }

    setAppState(AppState.GENERATING);
    setActiveStyle(selectedStyle);
    setError(null);
    try {
      const result = await generateHeadshot(uploadedImage, selectedStyle.prompt);
      setGeneratedImage(result);
      setAppState(AppState.RESULT_READY);
    } catch (err) {
      console.error(err);
      setError('Failed to generate headshot. Please try again.');
      // Revert to previous state if generation fails
      if (generatedImage) {
        setAppState(AppState.RESULT_READY);
        setSelectedStyle(activeStyle);
      } else {
        setAppState(AppState.IMAGE_UPLOADED);
      }
      setPreviousGeneratedImage(null); // Clear previous image on error
    }
  }, [uploadedImage, selectedStyle, generatedImage, activeStyle, appState]);
  
  useEffect(() => {
    // Automatically trigger regeneration when a new style is selected on the results page
    if (appState === AppState.RESULT_READY && selectedStyle && activeStyle && selectedStyle.id !== activeStyle.id) {
        handleGenerateClick();
    }
  }, [selectedStyle, activeStyle, appState, handleGenerateClick]);


  const handleEdit = useCallback(async (editPrompt: string) => {
    if (!generatedImage) return;

    setAppState(AppState.EDITING);
    setError(null);
    // An edit creates a new "base" image, so the comparison is no longer valid.
    setPreviousGeneratedImage(null);
    try {
      const result = await editImage(generatedImage, editPrompt);
      setGeneratedImage(result);
      setAppState(AppState.RESULT_READY);
    } catch (err) {
      console.error(err);
      setError('Failed to edit image. Please try again.');
      setAppState(AppState.RESULT_READY);
    }
  }, [generatedImage]);
  
  const handleReset = () => {
    setAppState(AppState.INITIAL);
    setUploadedImage(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setPreviousGeneratedImage(null);
    setError(null);
    setActiveStyle(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header onReset={handleReset} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl mx-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {appState === AppState.INITIAL && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}

          {(appState === AppState.IMAGE_UPLOADED || (appState === AppState.GENERATING && !generatedImage)) && uploadedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 1: Your Selfie</h2>
                <img src={uploadedImage} alt="User selfie" className="rounded-lg shadow-lg object-contain max-h-96 w-auto" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 2: Choose a Style</h2>
                <StyleSelector
                  styles={HEADSHOT_STYLES}
                  selectedStyle={selectedStyle}
                  onSelect={handleStyleSelect}
                />
                <button
                  onClick={handleGenerateClick}
                  disabled={appState === AppState.GENERATING}
                  className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-md"
                >
                  {appState === AppState.GENERATING ? <Spinner /> : 'Generate Headshot'}
                </button>
              </div>
            </div>
          )}
          
          {(appState === AppState.RESULT_READY || appState === AppState.EDITING || (appState === AppState.GENERATING && generatedImage)) && generatedImage && (
             <GeneratedImageDisplay
                imageUrl={generatedImage}
                previousImageUrl={previousGeneratedImage}
                onEdit={handleEdit}
                isEditing={appState === AppState.EDITING}
                isGeneratingStyle={appState === AppState.GENERATING}
                onStartOver={handleReset}
                styles={HEADSHOT_STYLES}
                selectedStyle={selectedStyle}
                onSelectStyle={handleStyleSelect}
             />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;