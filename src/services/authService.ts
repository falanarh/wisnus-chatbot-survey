// src/services/authService.ts
import { apiRequest } from '@/utils/authConfig';

/**
 * Fungsi untuk melakukan registrasi pengguna baru
 * @param userData Data registrasi user (name, email, password)
 * @returns Promise dengan data user dan token
 */
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    // Simpan token jika ada
    if (result.success && result.data && result.data.token) {
      localStorage.setItem('auth_token', result.data.token);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
      throw error;
    }
    console.error("Registration error:", error);
    throw new Error("Terjadi kesalahan saat pendaftaran");
  }
}

/**
 * Fungsi untuk melakukan login pengguna
 * @param credentials Data login (email, password)
 * @returns Promise dengan data user dan token
 */
export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    // Simpan token jika ada
    if (result.success && result.data && result.data.token) {
      localStorage.setItem('auth_token', result.data.token);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      throw error;
    }
    console.error("Login error:", error);
    throw new Error("Login gagal");
  }
}

/**
 * Fungsi untuk logout pengguna
 */
export function logoutUser() {
  // Hapus token dari localStorage
  localStorage.removeItem('auth_token');
}

/**
 * Fungsi untuk memeriksa apakah pengguna sedang login
 * @returns boolean status login
 */
export function isAuthenticated() {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Fungsi untuk mendapatkan token
 * @returns string token
 */
export function getAuthToken() {
  return localStorage.getItem('auth_token');
}