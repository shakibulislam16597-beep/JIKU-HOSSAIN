import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

let app = null;
let auth = null;
let db = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = app ? getAuth(app) : null;
    db = app ? getFirestore(app) : null;
  }
} catch (err) {
  console.warn('Firebase initialization failed (fallback to offline/mock mode):', err);
}

export { app, auth, db };
