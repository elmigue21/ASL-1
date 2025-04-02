"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";

function backupPage() {
  const backupData = async () => {
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
      <div>backupPage</div>

      <Button
        onClick={() => {
          backupData();
        }}
      >BACKUP</Button>
      <Button
        onClick={() => {
          deleteData();
        }}
      >DELETE</Button>
    </>
  );
}

export default backupPage;
