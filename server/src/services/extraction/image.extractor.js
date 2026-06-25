import { extractFromDocument } from '../ai/gemini.service.js';
import { EXTRACTION_PROMPT } from '../ai/prompts.js';

export const extractFromImage = async (buffer, mimeType) => {
  return extractFromDocument(buffer, mimeType, EXTRACTION_PROMPT);
};
