import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/','/api(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Handle admin routes - delegate admin check to API routes and pages
  if (isAdminRoute(req) || isAdminApiRoute(req)) {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    
    // For admin routes, we'll let the API routes and pages handle the admin verification
    // to avoid edge runtime issues with mongoose
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}