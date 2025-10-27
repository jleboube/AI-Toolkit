import React from 'react';
import { ChatMessage, MessageSender } from '../types';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  const isAI = message.sender === MessageSender.AI;
  const isSystem = message.sender === MessageSender.SYSTEM;

  const messageClass = isUser
    ? 'bg-blue-600 self-end'
    : isAI
    ? 'bg-gray-700 self-start'
    : 'bg-transparent text-gray-400 self-center text-center text-sm';

  const avatarClass = isAI ? 'bg-cyan-500' : 'bg-blue-500';
  const avatarText = isAI ? 'AI' : 'You';

  // Remove LaTeX-style dollar sign delimiters from AI and System messages for cleaner display.
  const displayText = (isAI || isSystem) ? message.text.replace(/\$/g, '') : message.text;

  return (
    <div className={`flex items-end gap-3 w-full my-2 ${isUser ? 'justify-end' : 'justify-start'} ${isSystem ? 'justify-center' : ''}`}>
      {isAI && (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${avatarClass}`}>
          {avatarText}
        </div>
      )}
      <div className={`max-w-xl rounded-lg p-4 text-white ${messageClass} ${isSystem ? 'px-0' : ''}`}>
        {message.image && <img src={message.image} alt="Uploaded problem" className="rounded-lg mb-3 max-w-xs" />}
        <p className="whitespace-pre-wrap">{displayText}</p>
      </div>
       {isUser && (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${avatarClass}`}>
          {avatarText}
        </div>
      )}
    </div>
  );
};

export default Message;