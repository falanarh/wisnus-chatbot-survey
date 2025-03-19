"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika tidak sedang loading dan tidak terautentikasi
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Tampilkan loading indicator saat memeriksa status autentikasi
  if (loading) {
    return (
      <div className="flex min-h-screen relative">
        {/* Background Layer */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Base Background Color */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

          {/* Grid Background - No inline styles for colors */}
          <div
            className="absolute inset-0 opacity-30 dark:opacity-10 bg-grid-light dark:bg-grid-dark"
            style={{
              backgroundSize: '30px 30px'
            }}
          />

          {/* Subtle Dots Pattern - Use classes instead of inline styles */}
          <div
            className="absolute inset-0 opacity-10 dark:opacity-5 bg-dots-light dark:bg-dots-dark"
            style={{
              backgroundSize: '20px 20px'
            }}
          />

          {/* Colored Blobs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 dark:bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        {/* Centered Loader */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Sedang memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Jika sudah terautentikasi, tampilkan konten halaman
  return isAuthenticated ? <>{children}</> : null;
}

export default ProtectedRoute;