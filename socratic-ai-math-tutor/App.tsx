import React, { useState, useCallback } from 'react';
import { ChatMessage, MessageSender } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const createInitialMessage = (): ChatMessage => ({
    id: 'initial',
    sender: MessageSender.AI,
    text: 'Hello! I am your Socratic math tutor. Please upload a photo of a calculus or algebra problem to begin.',
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const [geminiHistory, setGeminiHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentProblem, setCurrentProblem] = useState<string | null>(null);
  const [lastAIStep, setLastAIStep] = useState<string | null>(null);
  const [isChatMode, setIsChatMode] = useState<boolean>(false);

  const addMessage = (sender: MessageSender, text: string, image?: string) => {
    const newMessage: ChatMessage = { id: Date.now().toString() + Math.random(), sender, text, image };
    setChatMessages(prev => [...prev, newMessage]);
    if (sender !== MessageSender.SYSTEM) {
        const role = sender === MessageSender.USER ? 'user' : 'model';
        setGeminiHistory(prev => [...prev, { role, parts: [{text}] }])
    }
  };

  const handleAIResponse = (text: string) => {
      addMessage(MessageSender.AI, text);
      setLastAIStep(text);
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsChatMode(false);
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const dataUrl = URL.createObjectURL(file);
        
        setChatMessages([]);
        addMessage(MessageSender.USER, `Here's my problem:`, dataUrl);
        addMessage(MessageSender.SYSTEM, 'Analyzing image...');
        
        const problemText = await geminiService.analyseImageForProblem(base64Data, file.type);
        setCurrentProblem(problemText);
        addMessage(MessageSender.SYSTEM, `Problem identified: ${problemText}`);

        addMessage(MessageSender.SYSTEM, 'Thinking about the first step...');
        const firstStep = await geminiService.getFirstStep(problemText);
        handleAIResponse(firstStep);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      addMessage(MessageSender.AI, "I'm sorry, I had trouble reading that image. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskWhy = useCallback(async () => {
    if (!currentProblem || !lastAIStep) return;
    try {
      setIsLoading(true);
      addMessage(MessageSender.USER, "Why did we do that?");
      addMessage(MessageSender.SYSTEM, "Explaining the concept...");
      const explanation = await geminiService.explainStep(currentProblem, lastAIStep, geminiHistory);
      addMessage(MessageSender.AI, explanation);
    } catch (error) {
      console.error("Error explaining step:", error);
      addMessage(MessageSender.AI, "I seem to be having trouble explaining that right now. Could we try the next step instead?");
    } finally {
      setIsLoading(false);
    }
  }, [currentProblem, lastAIStep, geminiHistory]);

  const handleNextStep = useCallback(async () => {
    if (!currentProblem) return;
    try {
      setIsLoading(true);
      addMessage(MessageSender.USER, "What's the next step?");
      addMessage(MessageSender.SYSTEM, "Thinking about the next step...");
      const nextStep = await geminiService.getNextStep(currentProblem, geminiHistory);
      handleAIResponse(nextStep);
    } catch (error) {
      console.error("Error getting next step:", error);
      addMessage(MessageSender.AI, "I'm not sure what the next step is. Perhaps we could try explaining the last one again?");
    } finally {
      setIsLoading(false);
    }
  }, [currentProblem, geminiHistory]);

  const handleNewProblem = () => {
    setChatMessages([createInitialMessage()]);
    setGeminiHistory([]);
    setCurrentProblem(null);
    setLastAIStep(null);
    setIsLoading(false);
    setIsChatMode(false);
  };
  
  const handleToggleChatMode = () => {
    setIsChatMode(prev => !prev);
  };
  
  const handleSendMessage = async (message: string) => {
    if (!currentProblem) return;
    try {
        setIsLoading(true);
        addMessage(MessageSender.USER, message);
        addMessage(MessageSender.SYSTEM, "Thinking...");
        const response = await geminiService.getChatResponse(currentProblem, geminiHistory, message);
        addMessage(MessageSender.AI, response);
    } catch (error) {
        console.error("Error getting chat response:", error);
        addMessage(MessageSender.AI, "I'm having trouble with that question right now. Let's get back to the steps, shall we?");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-900">
      <Header />
      <ChatWindow messages={chatMessages} isLoading={isLoading} />
      <InputArea
        onImageUpload={handleImageUpload}
        onAskWhy={handleAskWhy}
        onNextStep={handleNextStep}
        onNewProblem={handleNewProblem}
        onSendMessage={handleSendMessage}
        isProblemActive={!!currentProblem}
        isLoading={isLoading}
        isChatMode={isChatMode}
        onToggleChatMode={handleToggleChatMode}
      />
    </div>
  );
};

export default App;