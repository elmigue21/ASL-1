import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
dotenv.config();

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";

export const verifySupabaseToken = (token: string) => {
  if (!SUPABASE_JWT_SECRET) {
    console.log(SUPABASE_JWT_SECRET);
    console.log("NO SECRET");
    return;
  }
  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log("Token is valid:", decoded);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token", error);
    return null;
  }
};

// console.log("qweqweqwe");
// const userToken =
//   "eyJhbGciOiJIUzI1NiIsImtpZCI6IkRCNXArTVNEZ0hiMEl4RFEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FteWFydmJ4ZGJvdHFtaGpjZXhkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzMThmOWRiZi1mNDExLTQxMDgtOWVkMS03NTNmMjVjMjU1YmMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQxODc5NTc0LCJpYXQiOjE3NDE4NzU5NzQsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGUiOiJ0ZWFjaGVyIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDE4NzU5NzR9XSwic2Vzc2lvbl9pZCI6ImNiNTA0ZjdhLTIxNzUtNDJjZi1iNzUwLWZiZjk3MTk2YWIwZCIsImlzX2Fub255bW91cyI6ZmFsc2V9.1dTVKL5G21gqSLC8sOs8Gn5KPwByzMMGpSOBbL3_JUM";
// const verifiedPayload = verifySupabaseToken(userToken);

// if (verifiedPayload) {
//   console.log("Token is valid:", verifiedPayload);
// } else {
//   console.log("Token is invalid!");
// }
