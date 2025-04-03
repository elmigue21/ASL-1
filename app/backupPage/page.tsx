"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";
// import { getBackup } from "@/backend/controllers/backupController";
import Navbar from "../components/Navbar";
// import { toast } from "sonner";

function backupPage() {


  
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
     alert('BACKUPS GOT')
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
            getBackups();}}
          
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
      </div>
    </>
  );
}

export default backupPage;
