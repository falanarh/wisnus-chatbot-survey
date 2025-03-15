// src/utils/authConfig.ts
// Konfigurasi untuk menghubungkan ke API eksternal

/**
 * Konfigurasi untuk API autentikasi
 * Ganti URL dengan endpoint API yang sebenarnya
 */
export const authConfig = {
    // Base URL API Anda
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    
    // Endpoint spesifik
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
    
    // Nama key untuk token di localStorage
    tokenKey: 'auth_token',
    
    // Headers default
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  /**
   * Fungsi helper untuk request API
   * @param endpoint Endpoint API
   * @param options Options fetch
   * @returns Promise dengan hasil dari API
   */
  export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    try {
      // Mengambil token dari localStorage jika ada
      const token = localStorage.getItem(authConfig.tokenKey);
      
      // Headers default
      const headers: Record<string, string> = {
        ...authConfig.headers,
        ...((options.headers as Record<string, string>) || {}),
      };
      
      // Tambahkan token ke header Authorization jika ada
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Buat URL lengkap
      const url = `${authConfig.baseUrl}${endpoint}`;
      
      // Kirim request
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Parse response
      const data = await response.json();
      
      // Jika response tidak ok, throw error
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
      }
      
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }