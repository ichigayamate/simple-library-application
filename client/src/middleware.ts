import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("token");

  if (
    !auth &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/register"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    auth &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
