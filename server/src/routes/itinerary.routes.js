import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  generateItinerary,
  listItineraries,
  getItinerary,
  deleteItinerary,
  regenerateItinerary,
  enableSharing,
  disableSharing,
} from '../controllers/itinerary.controller.js';

const router = Router();

router.use(protect);

router.post('/generate', generateItinerary);
router.get('/', listItineraries);
router.get('/:id', getItinerary);
router.delete('/:id', deleteItinerary);
router.patch('/:id/regenerate', regenerateItinerary);
router.post('/:id/share', enableSharing);
router.delete('/:id/share', disableSharing);

export default router;
