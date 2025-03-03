'use client'
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();
export default function Home() {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);
useEffect(() => {
  const fetchData = async () => {
    console.log(supabase);

    const { data, error } = await supabase.from("users").select("*");

    console.log("Fetched Data:", data);
    console.log("Fetch Error:", error);

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      setData(data || []);
    }
  };

  fetchData();
}, []);

// const [user,setUser] = useState<any[]>([]);

const fetchUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    console.log(data); // Do something with the data
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

fetch("https://asl-topaz.vercel.app/api/users")
  .then((res) => res.json())
  .then((data) => console.log("Users:", data))
  .catch((error) => console.error("Error fetching users:", error));



  return (
    <div className="p-10">
<h1>{process.env.NODE_ENV}</h1>
<button onClick={()=>fetchUser()} className="bg-red-500">CLICK</button>

      <h1 className="text-xl font-bold">Supabase Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
