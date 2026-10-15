import admin from 'firebase-admin';
import { localDb } from './localDb.js';
import dotenv from 'dotenv';
dotenv.config();

let firestore = null;
let isFirebaseActive = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    let serviceAccount;
    // Check if it's raw JSON or a file path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      // Path to JSON file
      const fs = await import('fs');
      serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'utf-8'));
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firestore = admin.firestore();
    isFirebaseActive = true;
    console.log('✓ Connected to Firebase Firestore with Service Account');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    firestore = admin.firestore();
    isFirebaseActive = true;
    console.log('✓ Connected to Firebase Firestore via Environment Variables');
  } else {
    console.log('ℹ Firebase Admin credentials not provided. Using Persistent Local Storage engine.');
  }
} catch (error) {
  console.warn('⚠️ Could not initialize Firebase Admin SDK:', error.message);
  console.log('ℹ Falling back to Persistent Local Storage engine.');
}

export const dbService = {
  isFirebaseActive: () => isFirebaseActive,

  async saveScan(scanRecord) {
    if (isFirebaseActive && firestore) {
      try {
        const docRef = firestore.collection('scans').doc(scanRecord.id);
        await docRef.set(scanRecord);
        return scanRecord;
      } catch (err) {
        console.warn('Firestore write failed, falling back to localDb:', err.message);
        return localDb.saveScan(scanRecord);
      }
    }
    return localDb.saveScan(scanRecord);
  },

  async getScans(userId) {
    if (isFirebaseActive && firestore) {
      try {
        let query = firestore.collection('scans').orderBy('timestamp', 'desc');
        if (userId && userId !== 'all' && userId !== 'demo-user') {
          query = query.where('userId', '==', userId);
        }
        const snapshot = await query.limit(50).get();
        return snapshot.docs.map(doc => doc.data());
      } catch (err) {
        console.warn('Firestore query failed, falling back to localDb:', err.message);
        return localDb.getScans(userId);
      }
    }
    return localDb.getScans(userId);
  },

  async getScanById(scanId) {
    if (isFirebaseActive && firestore) {
      try {
        const doc = await firestore.collection('scans').doc(scanId).get();
        if (doc.exists) return doc.data();
        return localDb.getScanById(scanId);
      } catch (err) {
        console.warn('Firestore get failed, falling back to localDb:', err.message);
        return localDb.getScanById(scanId);
      }
    }
    return localDb.getScanById(scanId);
  },

  async deleteScan(scanId) {
    if (isFirebaseActive && firestore) {
      try {
        await firestore.collection('scans').doc(scanId).delete();
        await localDb.deleteScan(scanId); // keep in sync
        return true;
      } catch (err) {
        console.warn('Firestore delete failed, falling back to localDb:', err.message);
        return localDb.deleteScan(scanId);
      }
    }
    return localDb.deleteScan(scanId);
  },

  async getDashboardStats(userId) {
    // Both engines support aggregated statistics
    return localDb.getDashboardStats(userId);
  },

  async getSettings() {
    return localDb.getSettings();
  },

  async updateSettings(settings) {
    return localDb.updateSettings(settings);
  }
};

export { admin, firestore };
