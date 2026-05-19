import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/signup/tutor', '/about', '/pricing', '/blog', '/tutors'];
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith('/blog/'));

  // Auth routes (login, signup)
  const authRoutes = ['/login', '/signup', '/signup/tutor'];
  const isAuthRoute = authRoutes.includes(path);

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'tutor') {
      return NextResponse.redirect(new URL('/tutor/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is not logged in and trying to access protected routes
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in, check role-based access
  if (user && !isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Student trying to access tutor routes
    if (profile?.role === 'student' && path.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Tutor trying to access student routes
    if (profile?.role === 'tutor' && (path.startsWith('/dashboard') || path.startsWith('/practice') || path.startsWith('/mock-exam') || path.startsWith('/flashcards') || path.startsWith('/analytics') || path.startsWith('/achievements') || path.startsWith('/groups') || path.startsWith('/revision-plan') || path.startsWith('/bookings') || path.startsWith('/settings'))) {
      return NextResponse.redirect(new URL('/tutor/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
