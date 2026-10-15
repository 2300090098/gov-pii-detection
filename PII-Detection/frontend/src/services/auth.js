import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase.js';

// Local storage key for demo session state
const DEMO_USER_KEY = 'gov_pii_demo_user';

export const authService = {
  // Sign in using standard email/password
  async login(email, password) {
    localStorage.removeItem(DEMO_USER_KEY);
    try {
      if (auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, isDemo: false };
      }
    } catch (error) {
      console.warn('Firebase login attempt:', error.message);
      // If Firebase API key is not yet configured or invalid, fall back to seamless local auth
      if (error.code?.includes('api-key') || error.code?.includes('invalid-api-key') || error.code?.includes('network')) {
        return this.loginAsDemo(email);
      }
      throw error;
    }
    // Fallback demo user if Firebase is unconfigured
    return this.loginAsDemo(email);
  },

  // Register new account
  async register(email, password) {
    localStorage.removeItem(DEMO_USER_KEY);
    try {
      if (auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, isDemo: false };
      }
    } catch (error) {
      console.warn('Firebase registration attempt:', error.message);
      // If Firebase API key is not yet configured or invalid, fall back to seamless local auth
      if (error.code?.includes('api-key') || error.code?.includes('invalid-api-key') || error.code?.includes('network')) {
        return this.loginAsDemo(email);
      }
      throw error;
    }
    return this.loginAsDemo(email);
  },

  // Instant one-click Demo Analyst Mode
  loginAsDemo(customEmail = null) {
    const demoUser = {
      uid: 'demo-analyst-001',
      email: customEmail || 'analyst@gov-pii-shield.internal',
      displayName: 'Security Analyst (Demo)',
      isDemo: true,
      token: 'demo-session-' + Date.now()
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    return { user: demoUser, isDemo: true };
  },

  // Logout
  async logout() {
    localStorage.removeItem(DEMO_USER_KEY);
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Sign out error:', err.message);
      }
    }
  },

  // Get current active token for API Authorization header
  async getToken() {
    const demo = localStorage.getItem(DEMO_USER_KEY);
    if (demo) {
      try {
        const parsed = JSON.parse(demo);
        return parsed.token || 'demo-token';
      } catch (e) {
        return 'demo-token';
      }
    }

    if (auth && auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (err) {
        return 'demo-token';
      }
    }

    return 'demo-token';
  },

  // Subscribe to auth state changes
  onStateChange(callback) {
    const checkDemo = () => {
      const demo = localStorage.getItem(DEMO_USER_KEY);
      if (demo) {
        try {
          return JSON.parse(demo);
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    const initialDemo = checkDemo();
    if (initialDemo) {
      callback(initialDemo);
    }

    if (auth) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        const demo = checkDemo();
        if (demo) {
          callback(demo);
        } else if (firebaseUser) {
          callback(firebaseUser);
        } else {
          callback(null);
        }
      });
    } else {
      callback(initialDemo);
      return () => {};
    }
  }
};
