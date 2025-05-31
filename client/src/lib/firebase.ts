import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "brandscaling-platform.firebaseapp.com",
  projectId: "brandscaling-platform",
  storageBucket: "brandscaling-platform.firebasestorage.app",
  messagingSenderId: "920887831613",
  appId: "1:920887831613:web:601417c226e55c309ace54",
  measurementId: "G-D6NYNXSSLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;