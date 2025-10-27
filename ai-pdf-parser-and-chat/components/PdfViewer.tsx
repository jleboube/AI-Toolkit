import React, { useCallback, useRef } from 'react';
import type { ParsedData } from '../types';
import { UploadIcon } from './Icons';

// Add a global declaration for pdfjsLib to satisfy TypeScript
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PdfViewerProps {
  imageDataUrl: string | null;
  parsedData: ParsedData | null;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ imageDataUrl, parsedData, isLoading, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = useCallback(async (file: File | null) => {
    if (!file) return;

    if (file.type === 'application/pdf') {
      try {
        if (!window.pdfjsLib) {
          alert('PDF processing library is not loaded. Please check your internet connection and refresh.');
          return;
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1); // Process the first page
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Failed to get canvas context');

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        canvas.toBlob((blob) => {
          if (blob) {
            const imageFile = new File([blob], `${file.name}-page1.png`, { type: 'image/png' });
            onFileSelect(imageFile);
          } else {
            alert('Failed to convert PDF page to image. Please try another file.');
          }
        }, 'image/png');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error processing PDF:', error);
        alert(`An error occurred while processing the PDF: ${errorMessage}`);
      }
    } else if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Unsupported file type. Please upload an image or a PDF.');
    }
  }, [onFileSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] || null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelection(e.dataTransfer.files?.[0] || null);
  }, [handleFileSelection]);


  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto p-4 md:p-6" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="flex-1 flex flex-col gap-4">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
               <p className="text-gray-400">AI is parsing your document...</p>
            </div>
          </div>
        )}
        {!isLoading && !imageDataUrl && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Upload a Document</h2>
            <p className="text-gray-400 mb-6">Drag & drop an image or PDF, or click to select</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp, application/pdf"
            />
            <button
              onClick={handleButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Select File
            </button>
          </div>
        )}
        {imageDataUrl && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-blue-400">Uploaded Document</h3>
              <img src={imageDataUrl} alt="Uploaded Document" className="rounded-md w-full object-contain" />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 text-blue-400">Parsed Data</h3>
                {parsedData && parsedData.length > 0 ? (
                  <div className="space-y-4">
                    {parsedData.map((section) => (
                      <div key={section.id} className="bg-gray-700 p-4 rounded-md">
                        <h4 className="font-semibold text-blue-300 mb-2">{section.title}</h4>
                        <ul className="space-y-1 text-sm">
                          {section.fields.map((field) => (
                            <li key={field.id} className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-400 col-span-1 truncate">{field.key}</span>
                              <span className="text-gray-200 col-span-2">{field.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No data parsed yet.</p>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;