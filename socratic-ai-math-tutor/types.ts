
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  image?: string; 
}
