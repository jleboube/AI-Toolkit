
import React, { useState, useCallback } from 'react';
import PdfViewer from './components/PdfViewer';
import ChatInterface from './components/ChatInterface';
import { parsePdfImage, modifyDataStructure } from './services/geminiService';
import type { ParsedData, ChatMessage } from './types';

const App: React.FC = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (sender: 'user' | 'bot' | 'system', text: string) => {
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender, text }]);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setParsedData(null);
    setMessages([]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      setImageDataUrl(reader.result as string);
      try {
        const data = await parsePdfImage(file);
        setParsedData(data);
        addMessage('system', 'Document parsed successfully. You can now use the chat to modify the data structure.');
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        addMessage('system', `Error: ${err.message}`);
        setImageDataUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!parsedData) return;

    addMessage('user', message);
    setIsLoading(true);
    setError(null);

    try {
      const updatedData = await modifyDataStructure(parsedData, message);
      setParsedData(updatedData);
      addMessage('bot', "I've updated the data structure based on your request.");
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      addMessage('bot', `Sorry, I couldn't process that request. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [parsedData]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="p-4 bg-gray-800 border-b-2 border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-blue-400">Intelligent PDF Parser</h1>
        <p className="text-sm text-gray-400">Upload a document image and refine its structure with AI chat</p>
      </header>
       {error && (
        <div className="bg-red-500 text-white p-3 text-center">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-4 font-bold">X</button>
        </div>
      )}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <PdfViewer
          imageDataUrl={imageDataUrl}
          parsedData={parsedData}
          isLoading={isLoading && !parsedData} // Only show viewer loading on initial parse
          onFileSelect={handleFileSelect}
        />
        <ChatInterface
          parsedData={parsedData}
          onSendMessage={handleSendMessage}
          isLoading={isLoading && messages[messages.length-1]?.sender === 'user'} // Show chat loading on message send
          messages={messages}
        />
      </main>
    </div>
  );
};

export default App;
