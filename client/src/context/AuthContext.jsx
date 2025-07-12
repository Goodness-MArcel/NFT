import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
// import { checkNetworkStatus } from "../services/firebase"; // You can keep this if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const signup = async (email, password, username) => {
    try {
      setError(null);
      // if (!checkNetworkStatus()) throw new Error("No internet connection.");
      if (!email || !password || !username) throw new Error("All fields are required");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (username.length < 3) throw new Error("Username must be at least 3 characters");

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      console.log("Sign up data:", data);
      console.log("Sign up error:", signUpError);

      if (signUpError) throw signUpError;

      // The profile will be created automatically by the database trigger
      // No need to manually insert into profiles table anymore

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // if (!checkNetworkStatus()) throw new Error("No internet connection.");
      if (!email || !password) throw new Error("Email and password are required");

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (signInError) throw signInError;

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      setError(null);
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setCurrentUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logOut,
    loading,
    error,
    clearError,
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
