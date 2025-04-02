'use client'
import React, { Suspense } from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import EmailWindow from '../components/EmailWindow';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setOpenState } from "@/store/slices/emailWindowSlice";


const fetchEmail = async () => {

  console.log('fetch email')

  const {data:sessionData,error} = await supabase.auth.getSession(); 
  const token = sessionData.session?.access_token; 

  console.log('token', token)


const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/email/sendEmails`,
  {
    method: "POST", // ✅ Use POST instead of GET
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ emailIds: [51, 52, 53] }), // ✅ Convert to JSON string
  }
);
  const data = await response.json();
  console.log(data);

}



function TablesPage() {

  const dispatch = useDispatch();
  const openClicked = () => {
    dispatch(setOpenState(true));
  };
  return (
    <div>
      <Navbar />      
      <div className="z-45 fixed top-25 left-40 p-5">
        <Button onClick={()=>{openClicked()}}>OPEN WINDOW</Button>
        <Suspense fallback={<div>LOADING</div>}>
        <SubscriptionsTable />
        </Suspense>
        <Button onClick={()=>{fetchEmail()}}>qweqwe</Button>
      </div>
  <EmailWindow />
    </div>
  );
}

export default TablesPage
