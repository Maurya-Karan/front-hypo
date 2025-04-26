import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  // Redirect to Login if no token is found and the user is not already on the Login page
  if (!token && request.nextUrl.pathname !== "/Login") {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // Redirect to Home if a token is found and the user is on the Login page
  if (token && request.nextUrl.pathname === "/Login") {
    return NextResponse.redirect(new URL("/Home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Match all routes except static files and API routes
};