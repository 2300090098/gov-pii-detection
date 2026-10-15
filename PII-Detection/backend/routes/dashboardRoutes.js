import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;
