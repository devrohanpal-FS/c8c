import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getNextAuthSecret } from '@/lib/env';

const secret = getNextAuthSecret();
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Static asset fast-path (bypass middleware)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.png'
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin Frontend Pages (/admin/...)
  if (pathname.startsWith('/admin') || pathname === '/login') {
    // A. Login page handling
    if (pathname === '/admin/login' || pathname === '/login') {
      const token = await getToken({ req, secret });

      if (token && token.id && token.role) {
        const now = Date.now();
        const lastActivity = (token.lastActivity as number) || now;
        // If authenticated and still active, redirect straight to dashboard
        if (now - lastActivity <= INACTIVITY_TIMEOUT_MS) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      }
      return NextResponse.next();
    }

    // B. Verify authentication for all other /admin routes
    const token = await getToken({ req, secret });

    if (!token || !token.id || !token.role) {
      const loginUrl = new URL('/admin/login', req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      return response;
    }

    // C. Enforce Inactivity Session Expiration for ALL roles
    const lastActivity = (token.lastActivity as number) || 0;
    const now = Date.now();

    if (lastActivity > 0 && now - lastActivity > INACTIVITY_TIMEOUT_MS) {
      const loginUrl = new URL('/admin/login?error=SessionExpired', req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      return response;
    }

    const role = (token.role as string) || 'VIEWER';

    // D. Strict RBAC for Admin Pages:
    // Only SUPER_ADMIN can access Settings
    if (pathname.startsWith('/admin/settings')) {
      if (role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard?error=unauthorized', req.url));
      }
    }

    // Only SUPER_ADMIN and ADMIN can access Users or Audit Logs
    if (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/audit-logs')) {
      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard?error=unauthorized', req.url));
      }
    }

    return NextResponse.next();
  }

  // 3. Protect Admin API Endpoints (/api/admin/...)
  if (pathname.startsWith('/api/admin')) {
    // A. CSRF Check: Block cross-site origin requests to admin APIs
    const secFetchSite = req.headers.get('sec-fetch-site');
    if (secFetchSite === 'cross-site') {
      return NextResponse.json(
        { error: 'Forbidden: Cross-site request to administrative API blocked.' },
        { status: 403 }
      );
    }

    // B. Verify Token Authentication
    const token = await getToken({ req, secret });

    if (!token || !token.id || !token.role) {
      const response = NextResponse.json(
        { error: 'Unauthorized: Valid administrative session required.' },
        { status: 401 }
      );
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      return response;
    }

    const role = (token.role as string) || 'VIEWER';
    const lastActivity = (token.lastActivity as number) || 0;
    const now = Date.now();

    // C. Inactivity Expiration check (except on heartbeat endpoint)
    if (!pathname.startsWith('/api/admin/activity')) {
      if (lastActivity > 0 && now - lastActivity > INACTIVITY_TIMEOUT_MS) {
        const response = NextResponse.json(
          { error: 'Unauthorized: Session expired due to inactivity. Please log in again.' },
          { status: 401 }
        );
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        return response;
      }
    }

    // D. Enforce Read-Only privilege for VIEWER on mutating requests
    const isMutatingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase());
    if (isMutatingMethod && role === 'VIEWER') {
      return NextResponse.json(
        { error: 'Forbidden: Read-only accounts cannot create, edit, or delete content.' },
        { status: 403 }
      );
    }

    // E. Endpoint-specific RBAC:
    // Only SUPER_ADMIN can manage settings
    if (pathname.startsWith('/api/admin/settings')) {
      if (role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Super Admin privilege required for system settings.' },
          { status: 403 }
        );
      }
    }

    // Only SUPER_ADMIN and ADMIN can manage users or read audit logs
    if (pathname.startsWith('/api/admin/users') || pathname.startsWith('/api/admin/audit-logs')) {
      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Administrator privilege required for this endpoint.' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*', '/login'],
};
