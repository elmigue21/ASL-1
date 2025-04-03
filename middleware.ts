import { NextResponse,NextRequest } from "next/server";
// import { jwtVerify } from "jose";

export const config = {
  matcher: ["/dashboardPage","/regisPage","/tablesPage"]
};


const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export async function middleware(request: NextRequest) {
const { jwtVerify } = await import("jose");
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined!");
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }

  const token = request.cookies.get("token")?.value || "";
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000); 

      if (Date.now() >= payload.exp * 1000) {
        const response = NextResponse.redirect(
          new URL("/loginPage", request.url)
        );
          response.cookies.set("token", "", {
            maxAge: -1, 
            path: "/", 
          });
        return response;
      }
    } else {
      return NextResponse.redirect(new URL("/loginPage", request.url));
    }

  } catch (error) {
    return NextResponse.redirect(new URL("/loginPage", request.url));
  }

  return NextResponse.next();
}
