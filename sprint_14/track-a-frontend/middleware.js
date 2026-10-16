import { NextResponse } from 'next/server';

// ─── Phase 3: Protected Routes via Next.js Middleware ─────────────────────────
// Intercepts ALL requests before they reach the page component
// If unauthenticated user tries to access /dashboard → redirect to /login

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes accessible only to guests (unauthenticated users)
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read JWT from cookies (for SSR/middleware compatibility)
  // Note: For localStorage tokens, redirect logic is also handled client-side
  const token = request.cookies.get('auth-token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ── Rule 1: Protect dashboard routes ──────────────────────────────────────
  // If no token and trying to access /dashboard → redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // ── Rule 2: Redirect authenticated users away from login/register ──────────
  // If already has token and tries to visit /login or /register → go to /dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ─── Middleware Configuration ──────────────────────────────────────────────────
// Specify which paths this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
