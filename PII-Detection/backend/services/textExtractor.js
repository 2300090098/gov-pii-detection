/**
 * Text Extraction Service
 * Supports PDF, DOCX, and TXT files
 */
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

export async function extractTextFromFile(filePath, originalFilename, mimeType) {
  const ext = path.extname(originalFilename || filePath).toLowerCase();

  try {
    const fileBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    }

    if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value || '';
    }

    if (ext === '.txt' || mimeType === 'text/plain') {
      return fileBuffer.toString('utf-8');
    }

    // Default fallback attempt as text
    return fileBuffer.toString('utf-8');
  } catch (error) {
    console.error(`Error extracting text from ${originalFilename}:`, error.message);
    throw new Error(`Failed to extract text from ${originalFilename}: ${error.message}`);
  }
}
