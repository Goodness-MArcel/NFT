import { createContext, useContext, useEffect, useState } from "react";
import { auth, checkNetworkStatus } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const signup = async (email, password, username) => {
    try {
      setError(null);
      if (!checkNetworkStatus()) throw new Error("No internet connection.");
      if (!email || !password || !username) throw new Error("All fields are required");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (username.length < 3) throw new Error("Username must be at least 3 characters");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name in Firebase
      await updateProfile(user, { displayName: username });

      // Save to PostgreSQL via your backend
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          username,
        }),
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      if (!checkNetworkStatus()) throw new Error("No internet connection.");
      if (!email || !password) throw new Error("Email and password are required");

      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
