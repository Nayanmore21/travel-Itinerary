import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadDocuments,
  listDocuments,
  getDocument,
  deleteDocument,
  streamFile,
} from '../controllers/upload.controller.js';

const router = Router();

router.use(protect);

router.post('/documents', upload.array('files', 5), uploadDocuments);
router.get('/documents', listDocuments);
router.get('/documents/:id', getDocument);
router.delete('/documents/:id', deleteDocument);
router.get('/documents/:id/file', streamFile);

export default router;
