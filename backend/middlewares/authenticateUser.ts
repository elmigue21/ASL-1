import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
// import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config()

import path from 'path'
// const env = process.env.NODE_ENV || "local"; // fallback to local
// Hardcode the path to the .env.local file
const envPath = path.resolve(__dirname, '../../.env.local');
console.log('Attempting to load .env from:', envPath);

// Now explicitly call dotenv.config with the path
const result = dotenv.config({ path: envPath });

declare global {
  namespace Express {
    interface Request {
      supabaseUser?: SupabaseClient;
      user?: User | null;
    }
  }
}

// export const authenticateUser: RequestHandler = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//        res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     const supabaseUser = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       { global: { headers: { Authorization: `Bearer ${token}` } } }
//     );

//     const { data, error } = await supabaseUser.auth.getUser();
//     const user = data?.user;

//     if (error || !user) {
//        res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }

//     req.supabaseUser = supabaseUser; 
//     req.user = user; 

    
//     next(); 
//   } catch (error) {
//     console.error("Auth Middleware Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

import { Request, Response, NextFunction } from "express";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_JWT_SECRET || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log("supabase jwt secret" ,SUPABASE_JWT_SECRET)
  console.log("supabase url" ,SUPABASE_URL)
  console.log("supabase anon key" ,SUPABASE_ANON_KEY)
  throw new Error(
    "SUPABASE_JWT_SECRET is not defined in environment variables."

  );
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  try {
    const token =
      req.cookies?.access_token;
console.log(" NO TOKEN");
console.log(req.cookies.access_token)
    if (!token) {
      console.log(" NO TOKEN")
       res.status(401).json({ error: "Unauthorized: No token provided" });
       return
    }

     const { jwtVerify } = await import("jose");

    // Verify token
    const secret = new TextEncoder().encode(SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Create Supabase client with token
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Optional: Confirm user identity with Supabase
    const { data, error } = await supabaseUser.auth.getUser();
    if (error || !data.user) {
       res
        .status(401)
        .json({ error: "Unauthorized: Invalid Supabase user" });
        return
    }

    // Attach to request
    req.supabaseUser = supabaseUser;
    req.user = data.user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
     res.status(500).json({ error: "Internal Server Error" });
     return
  }
};