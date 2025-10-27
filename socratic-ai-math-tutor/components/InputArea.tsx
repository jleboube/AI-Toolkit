import React, { useRef, useState } from 'react';

interface InputAreaProps {
  onImageUpload: (file: File) => void;
  onAskWhy: () => void;
  onNextStep: () => void;
  onNewProblem: () => void;
  onSendMessage: (message: string) => void;
  isProblemActive: boolean;
  isChatMode: boolean;
  onToggleChatMode: () => void;
  isLoading: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode, className?: string }> = ({ onClick, disabled, children, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

const InputArea: React.FC<InputAreaProps> = ({ 
    onImageUpload, 
    onAskWhy, 
    onNextStep, 
    onNewProblem, 
    onSendMessage,
    isProblemActive, 
    isChatMode,
    onToggleChatMode,
    isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatInput, setChatInput] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendClick = () => {
      if (chatInput.trim()) {
          onSendMessage(chatInput.trim());
          setChatInput('');
      }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
        handleSendClick();
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="container mx-auto max-w-4xl flex items-center justify-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={isLoading || isProblemActive}
        />
        {!isProblemActive ? (
            <button
                onClick={handleUploadClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Upload a Math Problem
            </button>
        ) : isChatMode ? (
            <div className="w-full flex items-center gap-2">
                <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about algebra or calculus..."
                    className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                    disabled={isLoading}
                    autoFocus
                />
                <button 
                    onClick={handleSendClick} 
                    disabled={isLoading || !chatInput.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                    Send
                </button>
                <button 
                    onClick={onToggleChatMode}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white transition-colors text-sm px-3"
                    aria-label="Back to steps"
                >
                    Back to Steps
                </button>
            </div>
        ) : (
            <>
                <ActionButton onClick={onToggleChatMode} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white">Click here for chat</ActionButton>
                <ActionButton onClick={onAskWhy} disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-500 text-white">Why did we do that?</ActionButton>
                <ActionButton onClick={onNextStep} disabled={isLoading} className="bg-green-600 hover:bg-green-500 text-white">What's the next step?</ActionButton>
                <ActionButton onClick={onNewProblem} disabled={isLoading} className="bg-red-600 hover:bg-red-500 text-white">Start New Problem</ActionButton>
            </>
        )}
      </div>
    </div>
  );
};

export default InputArea;