import { Router } from 'express';
import { getSharedItinerary } from '../controllers/share.controller.js';

const router = Router();

router.get('/:shareToken', getSharedItinerary);

export default router;
