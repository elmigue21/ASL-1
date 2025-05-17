import { NextResponse, NextRequest } from "next/server";
// import { jwtVerify } from "jose";

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

  console.log(`[Middleware] Incoming request for: ${request.nextUrl.pathname}`);

  const token = request.cookies.get("access_token")?.value;
  // console.log("[Middleware] Access token from cookie:", token);

  const url = request.nextUrl.clone();

  // If user visits /loginPage but already has a valid token, redirect to dashboard
  if (url.pathname === "/loginPage") {
    console.log("[Middleware] At /loginPage route");

    if (!JWT_SECRET) {
      console.error("[Middleware] JWT_SECRET is not defined!");
      return NextResponse.redirect(new URL("/loginPage", request.url));
    }

    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        console.log("[Middleware] Token payload:", payload);

        if (payload.exp && Date.now() < payload.exp * 1000) {
          console.log(
            "[Middleware] Valid token found, redirecting to /dashboardPage"
          );
          url.pathname = "/dashboardPage";
          return NextResponse.redirect(url);
        } else {
          console.log(
            "[Middleware] Token expired or invalid for /loginPage route"
          );
          // Clear expired cookie
          const response = NextResponse.next();
          response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
          return response;
        }
      } catch (err) {
        console.error(
          "[Middleware] Token verification failed at /loginPage:",
          err
        );
        // Clear invalid token cookie
        const response = NextResponse.next();
        response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
        return response;
      }
    } else {
      console.log("[Middleware] No token found at /loginPage");
    }
    return NextResponse.next();
  }

  // For other protected routes

  if (!JWT_SECRET) {
    console.error("[Middleware] JWT_SECRET is not defined!");
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }

  if (!token) {
    console.warn("[Middleware] No token found, redirecting to /loginPage");
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // console.log("[Middleware] Verified token payload:", payload);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.warn(
        "[Middleware] Token expired, clearing cookie and redirecting to /loginPage"
      );
      const response = NextResponse.redirect(
        new URL("/loginPage", request.url)
      );
      response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
      return response;
    }

    // Optional admin route check
    if (request.nextUrl.pathname.startsWith("/admin")) {
      console.log("[Middleware] Accessing admin route");
      // Uncomment and customize your role check here:
      // const isAdmin = payload.user_metadata?.role === "admin";
      // if (!isAdmin) {
      //   console.warn("[Middleware] Unauthorized access to admin route");
      //   return NextResponse.redirect(new URL("/unauthorized", request.url));
      // }
    }

    console.log("[Middleware] Access granted, proceeding with request");
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification failed:", error);
    const response = NextResponse.redirect(new URL("/loginPage", request.url));
    response.cookies.set("access_token", "", { maxAge: -1, path: "/" });
    return response;
  }
}
