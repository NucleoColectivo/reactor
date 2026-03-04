'use client';
import type { User } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { UserProfile } from '@/types/user';

/**
 * Creates a user profile document in Firestore for a new user.
 * This is a non-blocking "fire-and-forget" operation.
 * @param user The Firebase Auth User object.
 */
export function createUserProfileDocument(user: User) {
  // This function assumes firebase is initialized. 
  // It should be called after sign-in.
  const db = getFirestore();
  const userDocRef = doc(db, 'users', user.uid);
  
  const userProfile: UserProfile = {
    id: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Usuario Anónimo',
    email: user.email,
    registrationDate: new Date().toISOString(),
  };

  // Uses the non-blocking firestore write which includes error handling.
  // We are not merging, so this will overwrite any existing document.
  // This is fine for a one-time profile creation.
  setDocumentNonBlocking(userDocRef, userProfile, { merge: false });
}
