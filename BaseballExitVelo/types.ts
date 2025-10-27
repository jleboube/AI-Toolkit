export type AppMode = 'camera' | 'upload';
export type Page = 'analyzer' | 'history';

export interface AnalysisResult {
  exitVelocity: string;
  analysis: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
}

export interface AnalysisHistoryItem extends AnalysisResult {
    id: string;
    timestamp: string;
}

// --- Google & Environment Types ---

// Define the structure for Google's Identity Services client
interface GoogleAccounts {
    id: {
        initialize: (config: { client_id: string; callback: (response: any) => void; }) => void;
        prompt: () => void;
        disableAutoSelect: () => void;
    };
}

// Extend the global Window interface for type safety
declare global {
  interface Window {
    // FIX: Correctly type the `window.google` object to include the `accounts` property, matching the structure of the Google Identity Services library.
    google: {
      accounts: GoogleAccounts;
    };
    process: {
      env: {
        GOOGLE_CLIENT_ID: string;
        API_KEY: string;
      }
    }
  }
}
