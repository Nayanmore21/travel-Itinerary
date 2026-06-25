import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

export const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};
