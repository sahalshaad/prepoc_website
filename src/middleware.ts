import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ADMIN_PATHS = ['/admin/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected path prefixes
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isUploadApi = pathname === '/api/upload'
  const isProtectedMediaApi = pathname.startsWith('/api/media') && !pathname.startsWith('/api/public/media')
  const isMediaApi = isProtectedMediaApi

  if (!isAdminPage && !isAdminApi && !isUploadApi && !isProtectedMediaApi) {
    return NextResponse.next()
  }

  const session = request.cookies.get('prepoc-admin-session')
  
  // Edge runtime cannot query SQLite directly.
  // Middleware does a lightweight check for cookie existence.
  // Full cryptographically secure DB session validation is enforced
  // downstream in the Server Components/Actions via requireAdmin().
  const isAuthenticated = !!session?.value

  // Handle protected API routes
  if (isAdminApi || isUploadApi || isMediaApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Handle Admin Pages
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Protect all other /admin/* routes
  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/upload',
    '/api/media'
  ],
}
