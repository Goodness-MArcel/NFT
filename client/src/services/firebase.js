import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC8BSmhfJezRl1BQVpwriGWzKv-UP4BVFM",
  authDomain: "artmagic-60ebc.firebaseapp.com",
  projectId: "artmagic-60ebc",
  // storageBucket: "artmagic-60ebc.firebasestorage.app",
  messagingSenderId: "104138336634",
  appId: "1:104138336634:web:cfa1ea89edd0d955428ec3",
  measurementId: "G-5XT0EVYKQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);


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

export { auth, db, analytics };
