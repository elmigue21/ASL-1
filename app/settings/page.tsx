// import { Subscript } from 'lucide-react'
'use client'
import React from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import { useState,useEffect } from 'react';
import Navbar from '../components/Navbar';




const settingsPage = () => {
  const [age,setAge] = useState(3);
  useEffect(()=>{
    console.log('effect')
  },[age])

  return (
    <div className="flex items-center justify-center">
      <div className="w-4/5 h-screen flex items-center justify-center">
      <Navbar></Navbar>
        {/* <SubscriptionsTable /> */}
        Age: {age}
        <button onClick={()=>setAge(age+1)}>button</button>
      </div>
    </div>
  );
}

export default settingsPage
