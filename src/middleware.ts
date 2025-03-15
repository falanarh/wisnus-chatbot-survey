import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Mendapatkan token dari cookie
  const token = request.cookies.get('auth_token')?.value;

  // URL saat ini
  const { pathname } = request.nextUrl;

  // Rute yang memerlukan autentikasi
  const protectedRoutes = ['/survey'];
  
  // Rute otentikasi
  const authRoutes = ['/auth'];

  // Debug logging
  console.log('Middleware: Current Path:', pathname);
  console.log('Middleware: Token:', token ? 'Present' : 'Not Found');

  // Jika mengakses halaman yang dilindungi tapi tidak memiliki token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    // Redirect ke halaman login
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Jika sudah login dan mencoba mengakses halaman auth
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    // Redirect ke dashboard
    return NextResponse.redirect(new URL('/survey', request.url));
  }

  // Lanjutkan request normal
  return NextResponse.next();
}

// Konfigurasi path yang akan diperiksa oleh middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};