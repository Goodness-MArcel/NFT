import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBZOUdqN_dq9ernQKfcMjMOzhYKTVYOKk",
  authDomain: "nft-c5918.firebaseapp.com",
  projectId: "nft-c5918",
  storageBucket: "nft-c5918.appspot.com",
  messagingSenderId: "650728676848",
  appId: "1:650728676848:web:4162a050f5d6c2601c9135",
  measurementId: "G-JGCGE1CSL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Analytics (with error handling)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log("Analytics not supported in this environment");
}

// Network status checker
export const checkNetworkStatus = () => {
  return navigator.onLine;
};

export { auth, db, storage, analytics };
