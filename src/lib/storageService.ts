import { getFirebaseStorage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  async uploadDocument(file: File, userId: string): Promise<string> {
    try {
      const storage = getFirebaseStorage();
      if (!storage) throw new Error('Firebase storage not initialized');
      
      // Create a unique document ID and filename with timestamp
      const timestamp = Date.now();
      const documentId = `doc_${timestamp}`;
      const filename = `${timestamp}_${file.name}`;
      
      // Create storage reference: users/{userId}/documents/{documentId}/{filename}
      // This matches the storage rules path
      const storageRef = ref(storage, `users/${userId}/documents/${documentId}/${filename}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  },
};
