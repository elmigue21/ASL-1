'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const ConfirmPage = () => {


    const handleClick =async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");  

        console.log('clicked')

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/confirm?token=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({}),
        });

        if(!response.ok){
            console.error("Failed to confirm subscription")
        }

        const data = await response.json();
        console.log("data", data)
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="relative w-full max-w-xs aspect-square">
        <Image
          src="/img/dempaLogo.png"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative w-full max-w-sm aspect-[2/1]">
        <Image
          src="/img/dempaLogoTxt.png"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <Button className="active:scale-95 active:bg-slate-500 transition-all hover:cursor-pointer" onClick={()=>{handleClick()}}>CONFIRM SUBSCRIPTION</Button>
    </div>
  );
}

export default ConfirmPage