export function errorHandler(err, req, res, next) {
  // Sanitize error logging to avoid leaking file contents or sensitive tokens
  console.error('[API Error]:', err.name || 'Error', ':', err.message);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds maximum allowable limit of 15MB.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected error occurred during security scan processing.'
  });
}
