// src/utils/authConfig.ts
// Konfigurasi untuk menghubungkan ke API eksternal

/**
 * Konfigurasi untuk API autentikasi
 * Ganti URL dengan endpoint API yang sebenarnya
 */
export const authConfig = {
    // Base URL API Anda
    baseUrl: 'https://your-api-endpoint.com/api',
    
    // Endpoint spesifik
    endpoints: {
      register: '/register',
      login: '/login',
      logout: '/logout',
      verify: '/verify',
      me: '/me',
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
  }