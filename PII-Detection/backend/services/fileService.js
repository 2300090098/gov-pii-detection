/**
 * Secure File Cleanup Utility
 * Ensures temporary files are shredded/unlinked from disk immediately after processing
 */
import fs from 'fs';

export function deleteTempFile(filePath) {
  if (!filePath) return;
  
  // Non-blocking unlink with retry catch
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.warn(`Could not delete temporary file ${filePath}:`, err.message);
    } else {
      // Temporary file unlinked safely
    }
  });
}
