import React, { useState } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className: string; // For the wrapper div
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-600 animate-pulse rounded-md"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
export default ImageWithLoader;
