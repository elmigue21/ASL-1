'use client'
import { supabase } from "@/lib/supabase";
import { useEffect/* , useState  */} from "react";

import { signIn , logout} from "../utils/auth";
// import {jwtDecode} from "jwt-decode";
import { SubscriptionsTable } from "./components/SubscriptionsTable";
// import { Subscription } from './../types/subscription';
import { verifySupabaseToken } from "@/utils/verifyToken";
// import { sendBulkEmails, emailData } from "@/utils/nodemailer";

export default function Home() {
  // const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
useEffect(() => {
},[]);


// const fetchSubscriptions = async () => {
//   const {data, error} = await supabase.from('subscriptions').select('*');
//   if(error){
//     console.log('error', error);
//     return;
//   }
//   setSubscriptions(data);
// }

// const sendd = () =>{
//   awa
// }



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
  const token = data?.session?.access_token;

  if (token) {
    // Decode JWT to extract the expiration timestamp
    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // Convert expiration timestamp (exp) to a readable date
    const expirationDate = new Date(payload.exp * 1000);
    console.log("JWT Token:", token);
    console.log("CHECKING TOKIENN", verifySupabaseToken(token));
    console.log(
      "Token Expiration Date & Time:",
      expirationDate.toLocaleString()
    );
  } else {
    console.log("No active session or token found.");
  }
};


// console.log("USERRRR", supabase.auth.getUser());
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    console.log("User signed out or session expired");
    // Redirect to login page or show login modal
  }
});


  return (
    <div className="p-10">
      <div className="flex w-full bg-blue-500 justify-evenly">
        <button onClick={() => logout()}>LOGOUT</button>
        <button onClick={() => login()} className="bg-red-500">
          LOGIN
        </button>
        <button onClick={() => logSession()} className="bg-red-500">
          LOG SESSION
        </button>
        {/* <button
          onClick={() => {
            console.log(subscriptions);
          }}
        >
          FETCH SUBSCRIPTIONS
        </button> */}
      </div>

      {/* <p>{subscriptions.map((sub) => sub.full_name).join(", ")}</p> */}

      <h1 className="text-xl font-bold">Supabase Data</h1>

      <SubscriptionsTable />
    </div>
  );
}
