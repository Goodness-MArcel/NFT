import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const signup = async (email, password, username) => {
    try {
      setError(null);
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

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        }

        if (mounted) {
          setCurrentUser(session?.user || null);
          setLoading(false);
          setInitializing(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(error.message);
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setCurrentUser(session?.user || null);
          setLoading(false);
          
          if (event === 'SIGNED_OUT') {
            // Clear any cached data
            setError(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
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
    initializing,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
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
