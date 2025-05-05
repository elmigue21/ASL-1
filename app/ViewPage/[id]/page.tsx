'use client'
import React from 'react'
import { useParams } from "next/navigation";
import Navbar from '@/app/components/Navbar';

function ViewPage() {
     const { id } = useParams();

  return (
    <>
    <Navbar/>
    <div  className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
      <div className="font-bold text-[#1E2E80] text-[1.60vw]">Subscriber Details</div>
      <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl shadow-gray-950/20 py-[6vh] px-[2.5vw]">

      </div>

    </div>
    </>
  )
}

export default ViewPage