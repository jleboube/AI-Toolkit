
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  // In a real app, you'd show a proper error to the user.
  // Here, we log to the console and the app will show a generic error on API call failure.
  console.error("VITE_GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY!);

export const suggestAlias = async (url: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const prompt = `Given this URL: "${url}", suggest a short, memorable, URL-safe slug. The slug should be 4-8 characters long, containing only lowercase letters and numbers. Respond with ONLY the slug text and nothing else.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const alias = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!alias) {
        throw new Error("AI did not return a valid alias.");
    }

    return alias;
  } catch (error) {
    console.error("Error suggesting alias:", error);
    throw new Error("Failed to get AI suggestion. Please try again.");
  }
};
