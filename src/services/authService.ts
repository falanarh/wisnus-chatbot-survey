// src/services/authService.ts

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
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Terjadi kesalahan pada server");
    }

    // Simpan token jika ada
    if (data.success && data.data && data.data.token) {
      localStorage.setItem("auth_token", data.data.token);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
      throw error;
    }
    console.error("Registration error:", error);
    throw new Error("Unknown error occurred");
    console.error("Registration error:", error);
    throw error;
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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login gagal");
    }

    // Simpan token jika ada
    if (data.success && data.data && data.data.token) {
      localStorage.setItem("auth_token", data.data.token);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      throw error;
    }
    console.error("Login error:", error);
    throw new Error("Unknown error occurred");
  }
}

/**
 * Fungsi untuk logout pengguna
 */
export function logoutUser() {
  // Hapus token dari localStorage
  localStorage.removeItem("auth_token");
}

/**
 * Fungsi untuk memeriksa apakah pengguna sedang login
 * @returns boolean status login
 */
export function isAuthenticated() {
  const token = localStorage.getItem("auth_token");
  return !!token;
}

/**
 * Fungsi untuk mendapatkan token
 * @returns string token
 */
export function getAuthToken() {
  return localStorage.getItem("auth_token");
}
