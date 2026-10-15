import { admin } from '../database/firebase.js';

export async function verifyAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo / guest mode, allow with guest user identifier
    req.user = {
      uid: 'demo-analyst-001',
      email: 'analyst@gov-pii-shield.internal',
      isDemo: true
    };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  // Check for client-side demo analyst token
  if (token.startsWith('demo-session-') || token === 'demo-token') {
    req.user = {
      uid: 'demo-analyst-001',
      email: 'analyst@gov-pii-shield.internal',
      isDemo: true
    };
    return next();
  }

  // Attempt Firebase ID token verification
  try {
    if (admin && admin.auth) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        isDemo: false
      };
      return next();
    }
  } catch (error) {
    console.warn('Firebase token verification failed:', error.message);
  }

  // Fallback to guest user
  req.user = {
    uid: 'demo-analyst-001',
    email: 'analyst@gov-pii-shield.internal',
    isDemo: true
  };
  next();
}
