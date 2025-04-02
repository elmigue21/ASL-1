import { NextResponse,NextRequest } from "next/server";
import { supabase } from "./supabase";

export const config = {
  matcher: ["/dashboardPage",],
//   runtime:'nodejs'
};

export async function middleware(request: NextRequest) {
  // Corrected async function declaration
console.log("middleware!");
  // const { data: sessionData } = await supabase.auth.getSession();
  // const token = sessionData.session?.access_token;
 const token = request.cookies.get("token"); // Get token from cookie
console.log('log token middleware', token)
 if (!token) {
   return NextResponse.redirect(new URL("/loginPage", request.url)); // Redirect if no token
 }


  console.log("middleware!");
  return NextResponse.next();
}
