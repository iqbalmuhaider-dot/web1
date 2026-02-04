import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
// Workaround for module resolution issues where firebase/auth exports are not found
import * as firebaseAuth from 'firebase/auth';
import { WebsiteData } from '../types';

const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = firebaseAuth as any;
type User = any;
type Auth = any;

let db: Firestore | null = null;
let auth: Auth | null = null;
const SITE_ID = 'sk-masjid-tanah-main';

// Hardcoded Config as requested
const firebaseConfig = {
  apiKey: "AIzaSyC-BVPaBVIIZq0BGl-F4dankxnWyqZxPts",
  authDomain: "website-sekolah-52d26.firebaseapp.com",
  projectId: "website-sekolah-52d26",
  storageBucket: "website-sekolah-52d26.firebasestorage.app",
  messagingSenderId: "364164541632",
  appId: "1:364164541632:web:b83d515332bf249dd49125",
  measurementId: "G-TQE7SQS88G"
};

export const initFirebase = () => {
  try {
    // Prevent double initialization
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    return true;
  } catch (error) {
    console.error("Firebase init error:", error);
    return false;
  }
};

// Call init immediately
initFirebase();

export const isFirebaseConfigured = () => !!db && !!auth;

export const loginWithGoogle = async () => {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    alert("Gagal Log Masuk: " + (error as any).message);
    return null;
  }
};

export const logoutUser = async () => {
  if (!auth) return;
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const saveWebsiteData = async (data: WebsiteData) => {
  if (!db) {
    return { success: false, error: "Database not connected." };
  }
  
  try {
    const docRef = doc(db, "sites", SITE_ID);
    await setDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error saving document: ", error);
    return { success: false, error };
  }
};

export const loadWebsiteData = async (): Promise<WebsiteData | null> => {
  if (!db) return null;

  try {
    const docRef = doc(db, "sites", SITE_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as WebsiteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};