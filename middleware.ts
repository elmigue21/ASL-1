import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: [
    "/loginPage",
    "/dashboardPage",
    "/regisPage",
    "/tablesPage",
    "/uploadPage",
    "/admin/:path*",
  ],
};

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { jwtVerify } = await import("jose");

  const token = request.cookies.get("access_token")?.value;
  const url = request.nextUrl.clone();

  // console.log(JWT_SECRET)
  // Pass through special Next.js paths
  if (
    url.pathname.startsWith("/.well-known/") ||
    url.pathname === "/_not-found"
  ) {
    return NextResponse.next();
  }

  if (!JWT_SECRET) {
    console.error("[Middleware] JWT_SECRET not defined");
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }
  //  console.log(url);
  // Handle /loginPage: if user has valid token, redirect to /dashboardPage
  if (url.pathname === "/loginPage") {
    // console.log(url)
    console.log("met loginpage if else")
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.exp && Date.now() < payload.exp * 1000) {
          // Valid token → redirect to dashboard
          url.pathname = "/dashboardPage";
          return NextResponse.redirect(url);
        }
      } catch {
        // invalid token → clear cookie and let user stay on loginPage
        const response = NextResponse.next();
        response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
        return response;
      }
    }
    // No token → just let user access loginPage
    return NextResponse.next();
  }

  // For other protected routes (dashboardPage, admin, etc.)

  // If no token, redirect to loginPage
  if (!token) {
    console.log("NO TOKEN")
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // If token expired → clear cookie and redirect to loginPage
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.timeLog(" EXPIRED TOKEN")
      const response = NextResponse.redirect(
        new URL("/loginPage", request.url)
      );
      response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
      return response;
    }

    // Optional: check admin routes here if you want
    if (url.pathname.startsWith("/admin")) {
      // e.g., if (!payload.user_metadata?.role === "admin") redirect unauthorized
    }

    // Token valid → allow access to requested route
    return NextResponse.next();
  } catch {
    // Invalid token → clear cookie and redirect to loginPage
    console.error("ERROR CAUSES REDIRECT")
    const response = NextResponse.redirect(new URL("/loginPage", request.url));
    response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
    return response;
  }
}
