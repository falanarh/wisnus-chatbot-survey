// src/utils/authConfig.ts
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
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    // Mengambil token dari localStorage atau cookie
    const token = 
      localStorage.getItem(authConfig.tokenKey) || 
      document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
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
    
    // Handle unauthorized access (token expired/invalid)
    if (response.status === 401) {
      // Logout user
      localStorage.removeItem(authConfig.tokenKey);
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      console.log(response);
      
      // Redirect to login page
      // window.location.href = '/auth';
      
      // throw new Error(response.statusText);
    }
    
    // Parse response
    const data = await response.json();
    
    // Jika response tidak ok, throw error
    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan pada server');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Terjadi kesalahan pada server');
    }
  }
}