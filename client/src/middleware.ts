import { NextRequest, NextResponse } from "next/server";
import { IResponse } from "./lib/scripts/backend";
import { User } from "./lib/interfaces/user";

export async function middleware(request: NextRequest) {
  const auth = request.cookies.get("token");

  if (
    !auth &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/register"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (auth) {
    // admin only routes
    const userData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
      headers: {
        Authorization: `Bearer ${auth.value}`,
      },
    })
      .then((res: Response) => res.json())
      .then((data: IResponse<User>) => data.data);
    const isAdmin = userData?.role === "admin";
    if (!isAdmin) {
      if (request.nextUrl.pathname === "/add" || request.nextUrl.pathname === "/borrows" || request.nextUrl.pathname.endsWith("/edit")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
