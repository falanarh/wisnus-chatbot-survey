"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingState from './LoadingState';

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

  if (loading) {
    return <LoadingState message="Sedang memuat..." />;
  }

  // Jika sudah terautentikasi, tampilkan konten halaman
  return isAuthenticated ? <>{children}</> : null;
}

export default ProtectedRoute;