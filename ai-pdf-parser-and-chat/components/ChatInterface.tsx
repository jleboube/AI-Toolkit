
import React, { useState, useRef, useEffect } from 'react';
import type { ParsedData, ChatMessage } from '../types';
import { SendIcon, BotIcon, UserIcon } from './Icons';

interface ChatInterfaceProps {
  parsedData: ParsedData | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  messages: ChatMessage[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ parsedData, onSendMessage, isLoading, messages }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800 border-l-2 border-gray-700">
      {/* Top Section: Data Summary */}
      <div className="p-4 md:p-6 border-b-2 border-gray-700">
        <h2 className="text-lg font-bold text-blue-400 mb-3">Real-time Data Summary</h2>
        <div className="bg-gray-900 p-3 rounded-lg max-h-48 overflow-y-auto text-sm">
          {parsedData && parsedData.length > 0 ? (
            <ul className="space-y-2">
              {parsedData.map(section => (
                <li key={`summary-${section.id}`}>
                  <p className="font-semibold text-blue-300">{section.title}</p>
                  <p className="text-gray-400 pl-2 text-xs">
                    Fields: {section.fields.map(f => `"${f.key}"`).join(', ') || 'None'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Upload a document to see its data summary.</p>
          )}
        </div>
      </div>

      {/* Middle Section: Chat History */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    {msg.sender === 'bot' ? <BotIcon className="w-5 h-5 text-blue-400" /> : null}
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.sender === 'user' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="p-3 rounded-lg bg-gray-700 rounded-bl-none flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Bottom Section: Input */}
      <div className="p-4 md:p-6 border-t-2 border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={parsedData ? "e.g., move Name above Address" : "Upload a document to start chatting"}
            disabled={!parsedData || isLoading}
            className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 pl-4 pr-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!parsedData || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
