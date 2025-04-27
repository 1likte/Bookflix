import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { currentUserAtom, isAuthLoadingAtom } from '../store/atoms';
import { User, SubscriptionStatus } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [isAuthLoading, setIsAuthLoading] = useAtom(isAuthLoadingAtom);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        } else {
          // If user doc doesn't exist (new signup), create one
          const newUser: User = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            subscription: 'free'
          };
          await setDoc(doc(db, 'users', user.uid), newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setIsAuthLoading]);

  // Sign up
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setIsAuthLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      // Create user doc in Firestore
      const newUser: User = {
        id: result.user.uid,
        email: result.user.email || '',
        displayName,
        subscription: 'free'
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUser);
      
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsAuthLoading(true);
      await firebaseSignOut(auth);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Update subscription
  const updateSubscription = async (subscription: SubscriptionStatus) => {
    if (!currentUser) return false;
    
    try {
      setIsAuthLoading(true);
      await setDoc(doc(db, 'users', currentUser.id), 
        { subscription }, 
        { merge: true }
      );
      
      setCurrentUser({
        ...currentUser,
        subscription
      });
      
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  return {
    currentUser,
    isAuthLoading,
    signUp,
    signIn,
    signOut,
    updateSubscription
  };
};