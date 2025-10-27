
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="container mx-auto max-w-4xl">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-3">
             <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-cyan-500">AI</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
