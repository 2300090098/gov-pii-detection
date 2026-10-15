import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

// GET /api/settings
router.get('/', getSettings);

// PUT /api/settings
router.put('/', updateSettings);

export default router;
