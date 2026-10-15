import { Router } from 'express';
import { getScans, getScanById, deleteScan } from '../controllers/historyController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

// GET /api/scans
router.get('/', getScans);

// GET /api/scans/:id
router.get('/:id', getScanById);

// DELETE /api/scans/:id
router.delete('/:id', deleteScan);

export default router;
