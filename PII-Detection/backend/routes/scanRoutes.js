import { Router } from 'express';
import { scanText, scanDocument } from '../controllers/scanController.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

// POST /api/scan/text
router.post('/text', scanText);

// POST /api/scan/document
router.post('/document', uploadMiddleware.single('document'), scanDocument);

export default router;
