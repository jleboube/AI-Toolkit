import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const analyseImageForProblem = async (imageData: string, mimeType: string): Promise<string> => {
  const imagePart = fileToGenerativePart(imageData, mimeType);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: [
            { text: "Extract the mathematical problem from this image. Present it clearly in a format that can be used for further analysis. Only return the problem itself." },
            imagePart
        ]
    }
  });
  return response.text;
};

export const getFirstStep = async (problem: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: {
        parts: [{
            text: `You are a compassionate, Socratic math tutor. A student has presented you with the following problem: "${problem}". 
            Your task is to provide ONLY the very first logical step to begin solving it. 
            Frame your response as a gentle suggestion. Do not solve it or give away more than the first step.
            For example: "A good place to start would be to distribute the 3x into the parentheses."
            Do not explain why yet. Be encouraging and concise.`
        }]
    },
    config: {
        thinkingConfig: { thinkingBudget: 32768 },
    },
  });
  return response.text;
};

export const explainStep = async (problem: string, lastStep: string, history: { role: string; parts: {text: string}[] }[]): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [{
                text: `You are a Socratic math tutor. The problem is "${problem}". The last step you suggested was "${lastStep}". The student has asked 'Why did we do that?'. 
                Explain the underlying mathematical concept or rule for this specific step in a clear, simple, and patient manner. 
                Focus only on this single concept. Keep the explanation focused and easy to understand for someone who is stuck.
                Previous conversation for context: ${JSON.stringify(history)}`
            }]
        },
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};

export const getNextStep = async (problem: string, history: { role: string; parts: {text: string}[] }[]): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [{
                text: `You are a Socratic math tutor. The problem is "${problem}". The conversation history is: ${JSON.stringify(history)}.
                Based on the previous steps, what is the single next logical step to solve the problem?
                State the step clearly and concisely, like you did before. Do not explain why, just provide the next action.`
            }]
        },
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};

export const getChatResponse = async (problem: string, history: { role: string; parts: {text: string}[] }[], userMessage: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [{
                text: `You are a compassionate, Socratic math tutor. A student is working on the problem: "${problem}".
                The conversation history so far is: ${JSON.stringify(history)}.
                The student has asked a direct question: "${userMessage}".

                Your role is to answer their question helpfully, but you must adhere to these strict rules:
                1.  **Stay on Topic:** Only discuss concepts related to Algebra and Calculus. Do not engage in any other topics.
                2.  **Socratic Method:** Do not simply give the answer. Guide the student to understand the concept behind their question.
                3.  **Context is Key:** Your explanation should be relevant to the current problem and the conversation history.
                4.  **Encourage, Don't Solve:** Help them understand, but do not solve the main problem for them. Your goal is to empower them to solve it themselves.

                Now, provide a helpful, Socratic response to the student's question.`
            }]
        },
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};