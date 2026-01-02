import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, getFirebaseDb } from './firebase';
import { doc, setDoc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const DEFAULT_CATEGORIES = [
  { name: 'food', emoji: '🍔', color: '#f97316', type: 'expense' },
  { name: 'transport', emoji: '🚗', color: '#3b82f6', type: 'expense' },
  { name: 'utilities', emoji: '💡', color: '#eab308', type: 'expense' },
  { name: 'entertainment', emoji: '🎬', color: '#ec4899', type: 'expense' },
  { name: 'shopping', emoji: '🛍️', color: '#8b5cf6', type: 'expense' },
  { name: 'health', emoji: '🏥', color: '#ef4444', type: 'expense' },
  { name: 'other', emoji: '📌', color: '#6b7280', type: 'expense' },
];

const createDefaultCategories = async (userId: string) => {
  try {
    const db = getFirebaseDb();
    if (!db) return;
    
    for (const category of DEFAULT_CATEGORIES) {
      await addDoc(collection(db, 'users', userId, 'categories'), {
        name: category.name,
        emoji: category.emoji,
        color: category.color,
        type: category.type,
        createdAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating default categories:', error);
    // Don't throw - this shouldn't block user creation
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    if (!auth || !db) throw new Error('Firebase not initialized');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document with profile data directly
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create default categories for new user
    await createDefaultCategories(user.uid);

    return user;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    if (!auth || !db) throw new Error('Firebase not initialized');
    
    const provider = new GoogleAuthProvider();
    
    // Add scopes for better user data
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters for better UX
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user document exists, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create default categories for new user
      await createDefaultCategories(user.uid);
    }

    return user;
  } catch (error: any) {
    console.error('Error logging in with Google:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');
    
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      resolve(null);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};
