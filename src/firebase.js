// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtZDZrRH9Ow5zpc4IgqMzd7-C7UzmRwFU",
  authDomain: "notes-app-73c7d.firebaseapp.com", 
  projectId: "notes-app-73c7d",
  storageBucket: "notes-app-73c7d.firebasestorage.app",
  messagingSenderId: "59536288134",
  appId: "1:59536288134:web:acbdc4a9a77a736024a407",
  measurementId: "G-WFBN89HBRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THEN use app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();