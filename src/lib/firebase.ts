import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side
let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const initializeFirebase = () => {
  if (typeof window === 'undefined') {
    // Server-side: return null
    return null;
  }

  if (app) {
    return { app, auth, db, storage };
  }

  try {
    // Check if Firebase app is already initialized
    const apps = getApps();
    if (apps.length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    return { app, auth, db, storage };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

// Lazy initialization
const getFirebaseServices = () => {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, db: null, storage: null };
  }

  if (!app) {
    initializeFirebase();
  }

  return { app, auth, db, storage };
};

// Export lazy getters
export const getFirebaseApp = () => getFirebaseServices().app;
export const getFirebaseAuth = () => getFirebaseServices().auth;
export const getFirebaseDb = () => getFirebaseServices().db;
export const getFirebaseStorage = () => getFirebaseServices().storage;

// For backward compatibility, export direct references (will be null on server)
export { app, auth, db, storage };

export type { FirebaseUser };
