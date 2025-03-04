'use client'
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import { signIn , logout} from "./utils/auth";

import dotenv from "dotenv";
// import { createClient } from '@supabase/supabase-js';

import {jwtDecode} from "jwt-decode";
dotenv.config();
export default function Home() {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
useEffect(() => {
  const fetchData = async () => {

    const {data, error} = await supabase.from('subscriptions').select('*');
    if(error){
      console.log('error', error);
      return;
    }
   setSubscriptions(data);


  };

  fetchData();
},[]);



  const login = async () => {
    try{
      const user = await signIn('user@example.com','12345');
      console.log(user);
    }catch(e){
      console.log(e)
    }
  }

  const logSession = async () => {
const { data } = await supabase.auth.getSession();
console.log("JWT Token:", data?.session?.access_token);


  }


console.log("USERRRR", supabase.auth.getUser());
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    console.log("User signed out or session expired");
    // Redirect to login page or show login modal
  }
});

const checkTokenExpiry = async () => {
  const { data: session } = await supabase.auth.getSession();


  if (session?.session?.access_token) {
    const decoded: { exp: number } = jwtDecode(session.session.access_token);
    const now = Math.floor(Date.now() / 1000);

    console.log('exp',decoded.exp);
    console.log('now',now);
    console.log('exp date',new Date(decoded.exp * 1000))
    if (decoded.exp < now) {
      console.log("Token expired, logging out user");
      await supabase.auth.signOut();
    }
  }
};

checkTokenExpiry();

  return (
    <div className="p-10">
      <h1>{process.env.NODE_ENV}</h1>
      <button onClick={()=>logout()}>LOGOUT</button>
      <button onClick={() => login()} className="bg-red-500">
        CLICK
      </button>
      {/* <button onClick={() => updateUser()} className="bg-red-500">
        UPDATE USER
      </button> */}
      <button onClick={() => logSession()} className="bg-red-500">
        LOG SESSION
      </button>
      <button onClick={()=>{console.log(subscriptions)}}>
        LOG SUIBSCRTIPTONS
      </button>

      <h1 className="text-xl font-bold">Supabase Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
