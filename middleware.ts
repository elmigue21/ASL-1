import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

export const config = {
  matcher: ["/dashboardPage","/regisPage"]
//   runtime:'nodejs'
};

export async function middleware(request: Request) {
  // Corrected async function declaration

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    return NextResponse.redirect(new URL("/loginPage", request.url)); // Redirect to login if no token
  }

  console.log("middleware!");
  return NextResponse.next();
}
