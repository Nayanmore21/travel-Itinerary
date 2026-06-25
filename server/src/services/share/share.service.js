import { customAlphabet } from 'nanoid';
import Itinerary from '../../models/Itinerary.js';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export const generateUniqueToken = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    const token = nanoid();
    const exists = await Itinerary.exists({ shareToken: token });
    if (!exists) return token;
  }
  throw new Error('Could not generate unique share token');
};
