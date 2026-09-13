import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

import { registerUser, loginUser, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

// Provide authentication state and actions to the component tree.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the existing session when the application starts.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        const data = response.data;
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Authenticate and keep the returned user in context.
  const login = async (credentials) => {
    const data = await loginUser(credentials.email, credentials.password);

    setUser(data.data?.user ?? data.user);

    return data;
  };

  // Register and automatically sign in the new user.
  const register = async (userData) => {
    const data = await registerUser(
      userData.name,
      userData.email,
      userData.password,
    );

    setUser(data.data?.user ?? data.user);

    return data;
  };

  // Always clear local authentication state, even if the API request fails.
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Access authentication state from a descendant of AuthProvider.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
