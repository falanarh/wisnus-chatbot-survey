"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  register as registerUser, 
  login as loginUser, 
  logout as logoutUser, 
  isAuthenticated as checkIsAuthenticated,
  getUserData,
  authenticateWithGoogle,
  LoginResponseData,
  RegisterRequestData,
  LoginRequestData
} from '@/services/auth';

interface AuthContextType {
  user: LoginResponseData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleAuth: (idToken: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = checkIsAuthenticated();
        setAuthenticated(isAuth);
        
        if (isAuth) {
          const userData = getUserData();
          if (userData) {
            setUser(userData as LoginResponseData);
          } else {
            // If user data not found, log out
            logoutUser();
            setAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Authentication check failed", err);
        logoutUser();
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Clear error messages
  const clearError = () => {
    setError(null);
  };

  // Register new user
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData: RegisterRequestData = { name, email, password };
      const loginData = await registerUser(userData);
      
      setUser(loginData);
      setAuthenticated(true);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Terjadi kesalahan saat pendaftaran';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const credentials: LoginRequestData = { email, password };
      const loginData = await loginUser(credentials);
      
      setUser(loginData);
      setAuthenticated(true);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Gagal login';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google authentication
  const googleAuth = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loginData = await authenticateWithGoogle(idToken);
      
      setUser(loginData);
      setAuthenticated(true);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Google authentication failed';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    
    // Redirect to login page
    window.location.href = '/auth?tab=login';
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: authenticated,
    register,
    login,
    googleAuth,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for accessing auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}