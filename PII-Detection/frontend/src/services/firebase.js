import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevelopmentOnly123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gov-pii-shield.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gov-pii-shield",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gov-pii-shield.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app;
let auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase client initialization warning:', error.message);
}

export { app, auth };
