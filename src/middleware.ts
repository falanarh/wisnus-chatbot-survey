import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fungsi middleware untuk memeriksa autentikasi
export function middleware(request: NextRequest) {
  // Mendapatkan token dari cookie atau localStorage
  const token = request.cookies.get('auth_token')?.value;

  // URL saat ini
  const { pathname } = request.nextUrl;

  // Rute yang memerlukan autentikasi
  const protectedRoutes = ['/survey'];
  
  // Rute otentikasi
  const authRoutes = ['/auth'];

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
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (biarkan API menangani otentikasi sendiri)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};