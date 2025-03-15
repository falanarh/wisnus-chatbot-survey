// src/services/authService.ts
import { apiRequest } from '@/utils/authConfig';

// Tipe untuk response API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Tipe untuk data login response
export interface LoginResponseData {
  _id: string;
  name: string;
  email: string;
  activeSurveySessionId?: string;
  token: string;
}

// Tipe untuk data registrasi
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

/**
 * Fungsi untuk melakukan registrasi pengguna baru
 * @param userData Data registrasi user (name, email, password)
 * @returns Promise dengan data login
 */
export async function registerUser(userData: RegisterUserData): Promise<LoginResponseData> {
  try {
    const result: ApiResponse<LoginResponseData> = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    // Simpan token dan user data jika registrasi berhasil
    if (result.success && result.data) {
      const loginData = result.data;
      
      // Simpan token di localStorage
      localStorage.setItem('auth_token', loginData.token);
      
      // Simpan user data di localStorage
      localStorage.setItem('user_data', JSON.stringify({
        _id: loginData._id,
        name: loginData.name,
        email: loginData.email,
        activeSurveySessionId: loginData.activeSurveySessionId
      }));

      return loginData;
    } else {
      throw new Error(result.message || 'Registrasi gagal');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Registrasi error:", error.message);
      throw error;
    }
    console.error("Registrasi error:", error);
    throw new Error("Registrasi gagal");
  }
}

/**
 * Fungsi untuk melakukan login pengguna
 * @param credentials Data login (email, password)
 * @returns Promise dengan data login
 */
export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<LoginResponseData> {
  try {
    const result: ApiResponse<LoginResponseData> = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    // Simpan token dan user data jika login berhasil
    if (result.success && result.data) {
      const loginData = result.data;
      
      // Simpan token di localStorage
      localStorage.setItem('auth_token', loginData.token);
      
      // Simpan user data di localStorage
      localStorage.setItem('user_data', JSON.stringify({
        _id: loginData._id,
        name: loginData.name,
        email: loginData.email,
        activeSurveySessionId: loginData.activeSurveySessionId
      }));

      return loginData;
    } else {
      throw new Error(result.message || 'Login gagal');
    }
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
  // Hapus token dan user data dari localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
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

/**
 * Fungsi untuk mendapatkan data pengguna
 * @returns User data atau null
 */
export function getUserData(): LoginResponseData | null {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}