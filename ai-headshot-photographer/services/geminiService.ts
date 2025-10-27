
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const getBase64Data = (dataUrl: string): { mimeType: string; data: string } => {
  const [header, data] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
  return { mimeType, data };
};

const extractImageFromResponse = (response: GenerateContentResponse): string => {
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image data found in the response");
};

export const generateHeadshot = async (imageDataUrl: string, stylePrompt: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const { mimeType, data } = getBase64Data(imageDataUrl);

  const model = 'gemini-2.5-flash-image';
  
  const fullPrompt = `Generate a generic professional headshot of the person in the image. The style should be: ${stylePrompt}. The generated person should look like the person in the photo but not be an exact copy. Focus on creating a high-quality, professional-looking photograph suitable for a corporate profile or LinkedIn. Do not include any text, watermarks, or logos in the generated image.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        { text: fullPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  return extractImageFromResponse(response);
};


export const editImage = async (imageDataUrl: string, editPrompt: string): Promise<string> => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable is not set");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
  
    const { mimeType, data } = getBase64Data(imageDataUrl);
  
    const model = 'gemini-2.5-flash-image';
  
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: editPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    return extractImageFromResponse(response);
};
