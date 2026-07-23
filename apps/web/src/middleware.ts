import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/jobs", "/resumes", "/companies"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // Check auth cookie/storage or redirect
  // Note: Zustand persist uses localStorage which is client-side only.
  // For proper SSR protection we would need cookies, but for this SaaS MVP,
  // we'll rely on client-side redirects for now or check an auth cookie if we set one.
  // Since we use localStorage, we can't reliably read it in middleware.
  // We'll let the client-side handle the redirect if token is missing.
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
