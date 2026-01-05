// src/services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
// Import Auth functions
import { 
  initializeAuth, 
  getAuth, 
  getReactNativePersistence 
} from 'firebase/auth'; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbFlkhQFfwoIN7cOoNKCbSa2zHOBwmNg4",
  authDomain: "sds-admin-app.firebaseapp.com",
  projectId: "sds-admin-app",
  storageBucket: "sds-admin-app.firebasestorage.app",
  messagingSenderId: "970781030120",
  appId: "1:970781030120:web:6f47922685c438aea8bb5d"
};

// 1. Initialize App (Prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth
let auth;
try {
  // Try to initialize with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  // If it fails (e.g. "Auth instance already exists"), retrieve the existing instance
  auth = getAuth(app);
}

// 3. Initialize Firestore
const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

const colRef = collection(firestore, "category");

export { auth, firestore, colRef };