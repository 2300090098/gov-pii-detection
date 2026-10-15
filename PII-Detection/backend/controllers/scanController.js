import { executeDetectionPipeline } from '../services/piiDetector/index.js';
import { extractTextFromFile } from '../services/textExtractor.js';
import { deleteTempFile } from '../services/fileService.js';
import { dbService } from '../database/firebase.js';

export async function scanText(req, res, next) {
  try {
    const { text, fileName = 'Pasted Text Scan', options = {} } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide text content to perform PII detection.'
      });
    }

    // Limit text length to prevent memory exhaustion (e.g. 500,000 characters)
    if (text.length > 500000) {
      return res.status(400).json({
        success: false,
        error: 'Text length exceeds the maximum allowed limit of 500,000 characters.'
      });
    }

    const userId = req.user ? req.user.uid : 'demo-user';

    // Retrieve user custom settings if available
    const userSettings = await dbService.getSettings();
    const mergedOptions = {
      fileName,
      userId,
      confidenceThreshold: userSettings.confidenceThreshold || 0.50,
      enabledCategories: userSettings.categories || null,
      enableGemini: userSettings.useGemini !== false,
      ...options
    };

    const scanResult = await executeDetectionPipeline(text, mergedOptions);

    // Save scan metadata in database (Firestore / localDb)
    await dbService.saveScan(scanResult);

    res.json({
      success: true,
      scan: scanResult
    });
  } catch (error) {
    next(error);
  }
}

export async function scanDocument(req, res, next) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'No document file uploaded. Please upload a PDF, DOCX, or TXT document.'
    });
  }

  try {
    const originalName = file.originalname;
    const filePath = file.path;

    // Extract text from the uploaded document
    const extractedText = await extractTextFromFile(filePath, originalName, file.mimetype);

    // Prompt specifies: "Delete temporary uploaded files after processing where practical"
    deleteTempFile(filePath);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No readable text could be extracted from the document. The document may be empty or contain non-text image scans without OCR.'
      });
    }

    const userId = req.user ? req.user.uid : 'demo-user';
    const userSettings = await dbService.getSettings();

    const scanResult = await executeDetectionPipeline(extractedText, {
      fileName: originalName,
      userId,
      confidenceThreshold: userSettings.confidenceThreshold || 0.50,
      enabledCategories: userSettings.categories || null,
      enableGemini: userSettings.useGemini !== false
    });

    // Save scan metadata in database
    await dbService.saveScan(scanResult);

    res.json({
      success: true,
      scan: scanResult
    });
  } catch (error) {
    if (file && file.path) {
      deleteTempFile(file.path);
    }
    next(error);
  }
}
