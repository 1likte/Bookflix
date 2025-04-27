import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Configure Genkit instance
export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

// Define reusable flows
export const helloFlow = ai.defineFlow('helloFlow', async (name: string) => {
  const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
  return text;
});