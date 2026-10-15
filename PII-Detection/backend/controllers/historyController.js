import { dbService } from '../database/firebase.js';

export async function getScans(req, res, next) {
  try {
    const userId = req.user ? req.user.uid : 'demo-user';
    const scans = await dbService.getScans(userId);

    // Return sanitized scan list without bulky full preview for list performance
    const summaryList = scans.map(s => ({
      id: s.id,
      fileName: s.fileName,
      timestamp: s.timestamp,
      detectionCount: s.detectionCount,
      riskLevel: s.riskLevel,
      riskScore: s.riskScore,
      summary: s.summary,
      categoriesDetected: s.categoriesDetected || [],
      meta: s.meta
    }));

    res.json({
      success: true,
      scans: summaryList
    });
  } catch (error) {
    next(error);
  }
}

export async function getScanById(req, res, next) {
  try {
    const { id } = req.params;
    const scan = await dbService.getScanById(id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found.'
      });
    }

    res.json({
      success: true,
      scan
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScan(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteScan(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found or already removed.'
      });
    }

    res.json({
      success: true,
      message: 'Scan record securely deleted from registry.'
    });
  } catch (error) {
    next(error);
  }
}
