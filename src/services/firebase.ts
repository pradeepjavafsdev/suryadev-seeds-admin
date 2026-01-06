import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeAuth, 
  getAuth,
  Auth
} from 'firebase/auth'; 
import { getReactNativePersistence } from 'firebase/auth/react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBbFlkhQFfwoIN7cOoNKCbSa2zHOBwmNg4",
  authDomain: "sds-admin-app.firebaseapp.com",
  projectId: "sds-admin-app",
  storageBucket: "sds-admin-app.firebasestorage.app",
  messagingSenderId: "970781030120",
  appId: "1:970781030120:web:6f47922685c438aea8bb5d"
};

// Initialize App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with proper typing
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

// Initialize Firestore (simple - no cache config)
const firestore = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Collections
const colRef = collection(firestore, "category");

export { auth, firestore, storage, colRef };