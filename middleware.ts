export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/home/:path*',
    '/tab/:path*',
    '/menu/:path*',
    '/cart/:path*',
    '/scan/:path*',
    '/settings/:path*',
    '/history/:path*',
    '/payment/:path*',
  ],
}

