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

// Fungsi untuk menangani kesalahan API
function handleApiError(result: ApiResponse<unknown>): never {
  const errorMessage = result.message || 'Terjadi kesalahan pada server';
  throw new Error(errorMessage);
}

// Fungsi untuk menyimpan token
function saveToken(token: string) {
  // Simpan token di cookie
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`;
  
  // Simpan token di localStorage sebagai fallback
  localStorage.setItem('auth_token', token);
}

/**
 * Fungsi untuk melakukan registrasi pengguna baru
 */
export async function registerUser(userData: RegisterUserData): Promise<LoginResponseData> {
  try {
    const result: ApiResponse<LoginResponseData> = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    // Periksa keberhasilan response
    if (!result.success) {
      return handleApiError(result);
    }

    // Pastikan data tersedia
    if (!result.data) {
      throw new Error('Tidak ada data yang dikembalikan dari server');
    }

    const loginData = result.data;
    
    // Simpan token
    saveToken(loginData.token);
    
    // Simpan user data di localStorage
    localStorage.setItem('user_data', JSON.stringify({
      _id: loginData._id,
      name: loginData.name,
      email: loginData.email,
      activeSurveySessionId: loginData.activeSurveySessionId
    }));

    return loginData;
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

    // Periksa keberhasilan response
    if (!result.success) {
      return handleApiError(result);
    }

    // Pastikan data tersedia
    if (!result.data) {
      throw new Error('Tidak ada data yang dikembalikan dari server');
    }

    const loginData = result.data;
    
    // Simpan token
    saveToken(loginData.token);
    
    // Simpan user data di localStorage
    localStorage.setItem('user_data', JSON.stringify({
      _id: loginData._id,
      name: loginData.name,
      email: loginData.email,
      activeSurveySessionId: loginData.activeSurveySessionId
    }));

    return loginData;
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
  // Hapus token dari cookie
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Hapus token dan user data dari localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}

/**
 * Fungsi untuk memeriksa apakah pengguna sedang login
 */
export function isAuthenticated() {
  // Cek token dari localStorage atau cookie
  const tokenFromStorage = localStorage.getItem('auth_token');
  const tokenFromCookie = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  const token = tokenFromStorage || tokenFromCookie;
  
  // Cek apakah token ada dan tidak kosong
  return !!token;
}

/**
 * Fungsi untuk mendapatkan token
 */
export function getAuthToken() {
  // Cek dari cookie terlebih dahulu
  const tokenFromCookie = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  return tokenFromCookie || localStorage.getItem('auth_token');
}

/**
 * Fungsi untuk mendapatkan data pengguna
 */
export function getUserData(): LoginResponseData | null {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}