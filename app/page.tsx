'use client'
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import { signIn , logout} from "./utils/auth";

import dotenv from "dotenv";
// import { createClient } from '@supabase/supabase-js';

import {jwtDecode} from "jwt-decode";
dotenv.config();

interface Subscription{
  id: number;
  updated_from_linkedin: Date;
  full_name:string;
  first_name:string;
  last_name:string;
  current_position:string;
  Field1:string;
  person_linkedin_url:string;
  company_name:string;
  person_city:string;
  person_state:string;
  person_country:string;
  person_industry:string;
  tags:string;
  company_website:string;
  email1:string;
  email2:string;
  email3:string;
  email4:string;
  phone1:string;
  phone2:string;
  phone3:string;
  phone4:string;
  person_facebook_url:string;
  company_linkedin_url:string;
  created_by:string;
  lead_status:string;
}


export default function Home() {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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

setData([...data, { id: 1, name: "Item 1" }]);


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
