import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize local DB file if not present
function initDb() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      scans: [],
      settings: {
        categories: {
          aadhaar: true,
          pan: true,
          passport: true,
          driving_license: true,
          voter_id: true,
          gov_id: true,
          phone: true,
          email: true,
        },
        confidenceThreshold: 0.55,
        autoDeleteFiles: true,
        useGemini: true,
        theme: 'dark'
      }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readData() {
  initDb();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading local DB, resetting to defaults:', error.message);
    initDb();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const localDb = {
  // Scans operations
  async saveScan(scanRecord) {
    const data = readData();
    // Prepend new scan (newest first)
    data.scans.unshift(scanRecord);
    writeData(data);
    return scanRecord;
  },

  async getScans(userId) {
    const data = readData();
    if (!userId || userId === 'all') {
      return data.scans;
    }
    return data.scans.filter(s => s.userId === userId || s.userId === 'anonymous' || s.userId === 'demo-user');
  },

  async getScanById(scanId) {
    const data = readData();
    return data.scans.find(s => s.id === scanId) || null;
  },

  async deleteScan(scanId) {
    const data = readData();
    const initialLength = data.scans.length;
    data.scans = data.scans.filter(s => s.id !== scanId);
    writeData(data);
    return data.scans.length < initialLength;
  },

  // Dashboard statistics
  async getDashboardStats(userId) {
    const scans = await this.getScans(userId);

    const totalScans = scans.length;
    let totalDetections = 0;
    let highRiskScans = 0;
    let mediumRiskScans = 0;
    let lowRiskScans = 0;

    const categoryCounts = {
      'Aadhaar-like': 0,
      'PAN-like': 0,
      'Passport-like': 0,
      'Driving Licence-like': 0,
      'Voter ID-like': 0,
      'Gov ID/Beneficiary': 0,
      'Phone Number': 0,
      'Email Address': 0,
      'Other Sensitive': 0,
    };

    scans.forEach(scan => {
      totalDetections += scan.detectionCount || 0;
      if (scan.riskLevel === 'HIGH') highRiskScans++;
      else if (scan.riskLevel === 'MEDIUM') mediumRiskScans++;
      else lowRiskScans++;

      if (scan.categoriesDetected && Array.isArray(scan.categoriesDetected)) {
        scan.categoriesDetected.forEach(cat => {
          if (categoryCounts[cat] !== undefined) {
            categoryCounts[cat]++;
          } else {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });
      }
    });

    return {
      totalScans,
      totalDetections,
      highRiskScans,
      mediumRiskScans,
      lowRiskScans,
      categoryCounts,
      recentScans: scans.slice(0, 5).map(s => ({
        id: s.id,
        fileName: s.fileName,
        timestamp: s.timestamp,
        detectionCount: s.detectionCount,
        riskLevel: s.riskLevel,
        categoriesDetected: s.categoriesDetected || [],
      }))
    };
  },

  // Settings operations
  async getSettings() {
    const data = readData();
    return data.settings || {};
  },

  async updateSettings(newSettings) {
    const data = readData();
    data.settings = { ...data.settings, ...newSettings };
    writeData(data);
    return data.settings;
  }
};
