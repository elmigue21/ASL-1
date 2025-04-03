"use client";
import React, { useEffect,useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";
// import { getBackup } from "@/backend/controllers/backupController";
import Navbar from "../components/Navbar";
// import { toast } from "sonner";
import { backupBucket } from './../../backend/controllers/backupController';

interface BackupData{
  fileName:string,
  fileURL: string,
  id: number,
  created_at:Date,
}

function backupPage() {

  const [backups,setBackups] = useState<BackupData[]>([]);
  
  const backupData = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/backupData`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
         alert("BACKUPS GOT");
  };



   const getBackups = async () => {
     const { data: sessionData } = await supabase.auth.getSession();
     const token = sessionData.session?.access_token;

     if (!token) {
       return;
     }

     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/backups/getBackups`,
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`, // ✅ Attach token in request
           "Content-Type": "application/json",
         },
       }
     );
     const data = await response.json();
     console.log(data);
    //  alert('BACKUPS GOT')
     setBackups(data);
   };

   
   const backupBucket = async () => {
     const { data: sessionData } = await supabase.auth.getSession();
     const token = sessionData.session?.access_token;

     if (!token) {
       return;
     }

     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/backups/backupBucket`,
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`, // ✅ Attach token in request
           "Content-Type": "application/json",
         },
       }
     );
     const data = await response.json();
     console.log(data);
     alert("BACKUPS bucket");
   };

    const grabBucket = async () => {
     const { data: sessionData } = await supabase.auth.getSession();
     const token = sessionData.session?.access_token;
     console.log('grab bucket')

     if (!token) {
       return;
     }
      console.log("grab bucket2");

     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/backups/grabBucket`,
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`, // ✅ Attach token in request
           "Content-Type": "application/json",
         },
       }
     );
     const data = await response.json();
     console.log(data);
     alert("BACKUPS bucket");
   };

  const deleteData = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
console.log('clicked delete;')
    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId:51 }),
      }
    );
    const data = await response.json();
    console.log(data);
    console.log('end delete')
  };
  
  useEffect(()=>{
    getBackups();
  },[])

  return (
    <>
      <Navbar />
      <div className="absolute top-[11vh] left-[8.35vw]">
        <div>backupPage</div>

        <Button
          onClick={() => {
            backupData();
          }}
        >
          BACKUP DATA
        </Button>
        <Button
          onClick={() => {
            getBackups();
          }}
        >
          GET BACKUP
        </Button>
        <Button
          onClick={() => {
            deleteData();
          }}
        >
          DELETE
        </Button>
        <Button
          onClick={() => {
            backupBucket();
          }}
        >
          back up bucket
        </Button>
        <Button
          onClick={() => {
            grabBucket();
          }}
        >
          grab bucket
        </Button>
        <div>
          {backups.map((backup, index) => (
            <div key={index}>
              {backup.fileName}{" "}|{" "}
              {new Date(backup.created_at).toLocaleDateString("en-US", {
                weekday: "long", // Optional: to include the full weekday name (e.g., "Friday")
                year: "numeric", // Numeric year (e.g., "2025")
                month: "long", // Full month name (e.g., "April")
                day: "numeric", // Numeric day (e.g., "4")
              })}{" "}
              - {new Date(backup.created_at).toLocaleTimeString()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default backupPage;
