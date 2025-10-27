
export interface PdfField {
  id: string;
  key: string;
  value: string;
}

export interface PdfSection {
  id:string;
  title: string;
  fields: PdfField[];
}

export type ParsedData = PdfSection[];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
}
