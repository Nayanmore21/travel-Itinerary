import { getGenAI } from '../../config/gemini.js';

const MODEL = 'gemini-2.5-flash';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (err) => {
  const msg = err.message || '';
  return msg.includes('503') || msg.includes('Service Unavailable') ||
         msg.includes('429') || msg.includes('Too Many Requests');
};

const callGemini = async (parts, systemPrompt, responseSchema = null) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      ...(responseSchema && { responseSchema }),
      temperature: 0.2,
    },
  });

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }, ...parts],
    },
  ];

  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const result = await model.generateContent({ contents });
      const text = result.response.text();

      try {
        return JSON.parse(text);
      } catch {
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (err) {
      lastErr = err;
      if (isRetryable(err) && attempt < 3) {
        const delay = 2000 * (attempt + 1);
        console.warn(`[Gemini] ${err.message.slice(0, 80)} — retrying in ${delay / 1000}s (attempt ${attempt + 1}/3)`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
};

export const extractFromDocument = async (buffer, mimeType, prompt) => {
  const base64Data = buffer.toString('base64');
  const parts = [{ inlineData: { data: base64Data, mimeType } }];
  return callGemini(parts, prompt);
};

export const generateItinerary = async (prompt) => {
  return callGemini([{ text: prompt }], prompt);
};
