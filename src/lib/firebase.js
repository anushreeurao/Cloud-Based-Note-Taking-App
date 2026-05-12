import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).some(Boolean);

if (!hasFirebaseConfig) {
  // eslint-disable-next-line no-console
  console.warn("Firebase env vars are missing. Add values in your .env file.");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch(() => {});

export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
