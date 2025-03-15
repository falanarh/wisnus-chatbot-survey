"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  isAuthenticated,
  getUserData,
  LoginResponseData
} from '@/services/authService';

interface AuthContextType {
  user: LoginResponseData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Memeriksa apakah pengguna sudah login saat aplikasi dimuat
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);
        
        if (isAuth) {
          const userData = getUserData();
          if (userData) {
            setUser(userData);
          } else {
            // Jika gagal mendapatkan user data, logout
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

  // Fungsi untuk membersihkan error
  const clearError = () => {
    setError(null);
  };

  // Fungsi untuk mendaftarkan pengguna baru
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loginData = await registerUser({ name, email, password });
      
      setUser(loginData);
      setAuthenticated(true);
      
      // Redirect ke halaman home 
      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message || 'Terjadi kesalahan saat pendaftaran';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'Terjadi kesalahan saat pendaftaran';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk login pengguna
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loginData = await loginUser({ email, password });
      
      setUser(loginData);
      setAuthenticated(true);
      
      // Redirect ke halaman home 
      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message || 'Gagal login';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'Gagal login';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk logout pengguna
  const logout = () => {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    
    // Redirect ke halaman login
    window.location.href = '/auth';
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: authenticated,
    register,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook untuk menggunakan context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
}