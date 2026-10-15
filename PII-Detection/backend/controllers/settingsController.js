import { dbService } from '../database/firebase.js';

export async function getSettings(req, res, next) {
  try {
    const settings = await dbService.getSettings();
    res.json({
      success: true,
      settings,
      systemStatus: {
        firebaseConnected: dbService.isFirebaseActive(),
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
        geminiModel: 'gemini-3.8-flash'
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updated = await dbService.updateSettings(req.body);
    res.json({
      success: true,
      settings: updated
    });
  } catch (error) {
    next(error);
  }
}
