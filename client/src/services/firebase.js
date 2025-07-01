// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBZOUdqN_dq9ernQKfcMjMOzhYKTVYOKk",
  authDomain: "nft-c5918.firebaseapp.com",
  projectId: "nft-c5918",
  // storageBucket: "nft-c5918.appspot.com",
  messagingSenderId: "650728676848",
  appId: "1:650728676848:web:4162a050f5d6c2601c9135",
  measurementId: "G-JGCGE1CSL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics only if supported
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log("Analytics not supported in this environment");
}

export { auth, analytics };