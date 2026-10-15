import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import scanRoutes from './routes/scanRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Rate Limiting
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Limit each IP to 120 scan requests per window
  message: {
    success: false,
    error: 'Scan request limit exceeded. Please wait a few minutes before submitting new scans.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Gov-PII-Shield-Detection-Engine',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    geminiActive: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
  });
});

// API Routes
app.use('/api/scan', scanLimiter, scanRoutes);
app.use('/api/scans', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🛡️  Gov PII Detection & Security Platform Backend`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');
});

export default app;
