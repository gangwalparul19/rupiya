import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase auth not initialized');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase auth not initialized');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase auth not initialized');
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase auth not initialized');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase auth not initialized');
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): AuthUser | null {
    const auth = getFirebaseAuth();
    if (!auth) return null;
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.error('Firebase auth not initialized');
      return () => {};
    }
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  },
};
