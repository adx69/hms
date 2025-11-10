import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  });

  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/login' || pathname === '/doctor/login' || pathname === '/patient/login' || pathname === '/api/auth') {
    if (token) {
      // Redirect based on role
      const role = token.role;
      if (role === 'Patient') {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url));
      } else if (role === 'Doctor') {
        return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect dashboard and all child routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/patients') || 
      pathname.startsWith('/doctors') || pathname.startsWith('/appointments') || 
      pathname.startsWith('/billing') || pathname.startsWith('/settings')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Only allow Admin, Doctor, Receptionist to access staff routes
    if (token.role === 'Patient') {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }
  }

  // Protect doctor routes (singular /doctor/, not plural /doctors)
  if (pathname.startsWith('/doctor/') || pathname === '/doctor') {
    if (!token) {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }
    if (token.role !== 'Doctor') {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }
  }

  // Protect patient routes (singular /patient/, not plural /patients)
  if (pathname.startsWith('/patient/') || pathname === '/patient') {
    if (!token) {
      return NextResponse.redirect(new URL('/patient/login', request.url));
    }
    if (token.role !== 'Patient') {
      return NextResponse.redirect(new URL('/patient/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

