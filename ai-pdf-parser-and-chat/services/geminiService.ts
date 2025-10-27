
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


export const parsePdfImage = async (imageFile: File): Promise<ParsedData> => {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `Analyze this image of a document. Extract all key-value pairs and logical sections of information. Structure the output as a JSON array of sections. Each section must have a unique 'id' (e.g., 'section-1'), a 'title', and an array of 'fields'. Each field must have a unique 'id' (e.g., 'field-1'), a 'key', and a 'value'. Ensure all IDs are unique strings. Only return the JSON object. Example: [{ "id": "section-1", "title": "Personal Information", "fields": [{ "id": "field-1", "key": "Name", "value": "John Doe" }] }]`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, {text: prompt}] },
        config: {
            responseMimeType: "application/json",
        }
    });

    const text = response.text.trim();
    try {
        const parsedJson = JSON.parse(text);
        return parsedJson as ParsedData;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        throw new Error("The AI returned an invalid data structure. Please try another image.");
    }
};

export const modifyDataStructure = async (currentData: ParsedData, command: string): Promise<ParsedData> => {
    const dataSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  key: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
                required: ['id', 'key', 'value'],
              },
            },
          },
          required: ['id', 'title', 'fields'],
        },
      };

    const prompt = `You are an intelligent data structure manipulator. Your task is to modify a JSON structure based on a user's command.
The user's command is: "${command}"

The current JSON data structure is:
${JSON.stringify(currentData, null, 2)}

Apply the user's command to this JSON structure and return ONLY the modified, valid JSON object that adheres to the provided schema.
- If you move an item, ensure it is removed from its original location.
- If you create a new item (section or field), assign it a new, unique string ID (e.g., 'section-new-123').
- Preserve existing IDs for items that are not created or deleted.
- Do not add any commentary or explanation in your response.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: dataSchema,
        }
    });

    const text = response.text.trim();
    try {
        const parsedJson = JSON.parse(text);
        return parsedJson as ParsedData;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        throw new Error("The AI returned an invalid data structure after modification.");
    }
};
