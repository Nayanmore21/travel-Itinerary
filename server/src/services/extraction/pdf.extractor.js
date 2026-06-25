import { extractFromDocument } from '../ai/gemini.service.js';
import { EXTRACTION_PROMPT } from '../ai/prompts.js';

export const extractFromPDF = async (buffer) => {
  return extractFromDocument(buffer, 'application/pdf', EXTRACTION_PROMPT);
};
