'use client'
import React from 'react'
//import { useParams } from "next/navigation";
import Navbar from '../../components/Navbar'
import StepperList from '../../components/StepperList'

function ViewPage() {
    
  //  const { id } = useParams();

  return (
    <>
      <Navbar/>
      <div  className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
        <div className="font-bold text-[#1E2E80] text-[1.60vw]">Subscriber Details</div>
        <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl shadow-gray-950/20 py-[6vh] px-[2.5vw] relative border-2 border-slate-100">
          
          <button className="text-sm flex justify-between gap-x-2 absolute left-5 top-5 object-fit h-[23px] align-center cursor-pointer">
            <img src="/arrow-small-left.png" alt="arrow left" />
            Back
          </button>

          <button className="text-sm flex justify-between gap-x-2 absolute right-5 top-5 object-fit h-[23px] align-center cursor-pointer">
            Next Profile
            <img src="/arrow-small-right.png" alt="arrow right" />
          </button>

          <div className="w-5/9 h-full border-r-2 py-4">
            <span className="text-xl text-[#2F80ED]">Personal Information</span>

            <div className="grid grid-cols-2 gap-2 px-4 py-2">              
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">Subscriber ID</div>
                <div className="text-[14px]">1617</div>
              </div>
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">Active Status</div>
                <div className="text-[14px]">Active</div>
              </div>
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">Last Name</div>
                <div className="text-[14px]">Lastname</div>
              </div>
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">First Name</div>
                <div className="text-[14px]">Firstname</div>
              </div>
            </div>

            <span className="text-xl text-[#2F80ED]">Contact Details</span>
            <div className="grid grid-cols-2 gap-2 px-4 py-2">              
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">Phone Number</div>
                <div className="overflow-y-auto h-[15vh]">
                  <StepperList
                    emails={[
                      "email one",
                      "email two",
                      'email three'
                    ]}
                  />

                </div>
              </div>
              <div className="flex-col">
                <div className="text-[14px] font-medium text-slate-500">Email</div>
                <div className="text-[14px]">emails here</div>
              </div>
              
            </div>
          </div>

        </div>

      </div>

    </>
    
    
  )
}

export default ViewPage