import { dbService } from '../database/firebase.js';

export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user ? req.user.uid : 'demo-user';
    const stats = await dbService.getDashboardStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
}
