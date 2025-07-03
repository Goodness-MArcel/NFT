import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, checkNetworkStatus } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Signup function with retry logic
  const signup = async (email, password, username) => {
    try {
      setError(null);
      
      // Check network connectivity
      if (!checkNetworkStatus()) {
        throw new Error("No internet connection. Please check your network and try again.");
      }
      
      // Validate inputs
      if (!email || !password || !username) {
        throw new Error("All fields are required");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }

      console.log("Creating user account...");
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User account created, updating profile...");

      // Update user profile with display name
      await updateProfile(user, {
        displayName: username
      });

      console.log("Profile updated, saving to Firestore...");

      // Store additional user data in Firestore with retry
      const userData = {
        uid: user.uid,
        email: email.toLowerCase(),
        username: username,
        displayName: username,
        joinedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        bio: "New NFT enthusiast",
        avatar: null,
        coverImage: null
      };

      // Retry mechanism for Firestore operations
      let retries = 3;
      while (retries > 0) {
        try {
          await setDoc(doc(db, "users", user.uid), userData);
          console.log("User data saved to Firestore successfully");
          break;
        } catch (firestoreError) {
          retries--;
          console.warn(`Firestore save attempt failed, retries left: ${retries}`, firestoreError);
          
          if (retries === 0) {
            // If Firestore fails but auth succeeded, still return success
            console.warn("Firestore save failed, but user account was created successfully");
            break;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Login function with retry logic
  const login = async (email, password) => {
    try {
      setError(null);
      
      // Check network connectivity
      if (!checkNetworkStatus()) {
        throw new Error("No internet connection. Please check your network and try again.");
      }
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      console.log("Attempting to log in...");

      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      
      console.log("Login successful, checking user document...");

      // Check if user document exists in Firestore with retry
      let retries = 3;
      let userDocExists = false;
      
      while (retries > 0 && !userDocExists) {
        try {
          const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
          
          if (!userDoc.exists()) {
            console.log("User document doesn't exist, creating...");
            await setDoc(doc(db, "users", userCredential.user.uid), {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              username: userCredential.user.displayName || userCredential.user.email.split('@')[0],
              displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
              joinedAt: serverTimestamp(),
              createdAt: serverTimestamp(),
              bio: "NFT enthusiast",
              avatar: userCredential.user.photoURL || null,
              coverImage: null
            });
          }
          
          userDocExists = true;
          console.log("User document verified/created successfully");
          
        } catch (firestoreError) {
          retries--;
          console.warn(`Firestore check attempt failed, retries left: ${retries}`, firestoreError);
          
          if (retries === 0) {
            // If Firestore fails but auth succeeded, still allow login
            console.warn("Firestore check failed, but login was successful");
            break;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logOut = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `Logged in as ${user.email}` : "Logged out");
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logOut,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
