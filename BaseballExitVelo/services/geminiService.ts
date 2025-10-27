
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeHit(framesInBase64: string[]): Promise<AnalysisResult> {
  if (!framesInBase64 || framesInBase64.length === 0) {
    throw new Error("No frames provided for analysis.");
  }

  const imageParts = framesInBase64.map(frame => {
    // Strip the data URL prefix
    const base64Data = frame.split(',')[1];
    return {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };
  });

  const prompt = `You are an expert sports analyst specializing in baseball physics. Your task is to estimate the exit velocity of a baseball based on a sequence of video frames.

Analyze the following sequence of images showing a baseball being hit. The frames are in chronological order. Identify the moment of impact and estimate the ball's exit velocity in miles per hour (MPH). Consider the blur of the ball and bat, the batter's swing mechanics, and the initial trajectory. Provide your response in the specified JSON format. Your estimation should be plausible but is understood to be an approximation based on visual data.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          ...imageParts
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exitVelocity: {
              type: Type.STRING,
              description: 'The estimated exit velocity in MPH, e.g., "105.5"',
            },
            analysis: {
              type: Type.STRING,
              description: 'A brief, one-sentence analysis explaining the reasoning behind the velocity estimate.'
            }
          },
          required: ['exitVelocity', 'analysis'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Validate the parsed result
    if (typeof result.exitVelocity !== 'string' || typeof result.analysis !== 'string') {
        throw new Error('Invalid response format from API.');
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze the hit. The AI model could not process the request.");
  }
}
