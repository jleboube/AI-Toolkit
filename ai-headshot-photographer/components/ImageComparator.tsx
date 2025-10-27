import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparatorProps {
  beforeImageUrl: string;
  afterImageUrl: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ beforeImageUrl, afterImageUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  const handleTouchEnd = useCallback(() => {
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);


  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd]);
  

  // Clean up event listeners
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto aspect-square select-none overflow-hidden rounded-lg shadow-2xl"
    >
      {/* Before Image (Bottom Layer) */}
      <img
        src={beforeImageUrl}
        alt="Previous headshot"
        className="absolute top-0 left-0 w-full h-full object-contain"
        draggable={false}
      />
      
      {/* After Image (Top Layer, clipped) */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImageUrl}
          alt="Current headshot"
          className="absolute top-0 left-0 w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1.5 bg-white/75 cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5m2 10l5-5-5-5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;