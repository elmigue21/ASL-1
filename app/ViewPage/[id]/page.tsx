'use client'
import React from 'react'
import { useState } from 'react';
import { useParams, useRouter} from "next/navigation";
import Navbar from '../../components/Navbar'
import StepperList from '../../components/StepperList'
import Link from "next/link";

function ViewPage() {
    
    const { id } = useParams();
    const [active, setActive] = useState(true);
    const router = useRouter();

    const goToNextSub = () => {
        if (id) { 
            // Ensure id is a string (in case it's an array, take the first element)
            const idString = Array.isArray(id) ? id[0] : id;
            const nextId = parseInt(idString, 10) + 1; // Increment the id if it is defined
            router.push(`/ViewPage/${nextId}`); // Navigate to the next page with the incremented id
        } else {
            // Handle the case where id is undefined or invalid (optional)
            console.error('ID is undefined');
        }
    };
    const goToPrevSub = () => {
        if (id) { 
            // Ensure id is a string (in case it's an array, take the first element)
            const idString = Array.isArray(id) ? id[0] : id;
            const nextId = parseInt(idString, 10) - 1; // Increment the id if it is defined
            router.push(`/ViewPage/${nextId}`); // Navigate to the next page with the incremented id
        } else {
            // Handle the case where id is undefined or invalid (optional)
            console.error('ID is undefined');
        }
    };

  return (
    <>
      <Navbar/>
      <div  className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
        <div className="font-bold text-[#1E2E80] text-[1.60vw]">Subscriber Details</div>
        <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl shadow-gray-950/20 py-[6vh] px-[2.5vw] relative border-2 border-slate-100">
          
          <button 
          onClick={goToPrevSub}
          className="text-[2vh] flex justify-between gap-x-[1vw] absolute left-[2vw] top-[2vh] h-[4vh] object-contain align-center cursor-pointer hover:bg-gray-100 p-[0.5vh] px-[0.5vw] rounded-sm">
            <img src="/arrow-small-left.png" alt="arrow left" />
            Back
          </button>

          
          <button 
          onClick={goToNextSub}
          className="text-[2vh] flex justify-between gap-x-[1vw] absolute right-[2vw] top-[2vh] h-[4vh] object-contain align-center cursor-pointer hover:bg-gray-100 py-[0.5vh] px-[0.5vw] rounded-sm">
            Next Profile
            <img src="/arrow-small-right.png" alt="arrow right" />
          </button>
          
          <div className="flex flex-row">
          <div className="w-5/9 h-full border-r-2 py-4">
            <span className="text-[3vh] text-[#2F80ED]">Personal Information</span>

            <div className="grid grid-cols-2 gap-y-[2vh] px-[2vw] py-[2vh]">              
              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">Subscriber ID</div>
                <div className="text-[2vh]">{id}</div>
              </div>
              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">Active Status</div>
                
                <div className="flex gap-x-[0.5vw] items-center">
                  {active?
                  (
                  <>
                  <div className="h-[1.5vh] w-[1.5vh] bg-green-500 rounded-full"></div>
                  <div className="text-[2vh]">Active</div>
                  </>
                  ) : 
                  (
                  <>
                  <div className="h-[1.5vh] w-[1.5vh] bg-red-500 rounded-full"></div>
                  <div className="text-[2vh]">Inactive</div>
                  </>
                  )}
                  
                </div>
                
              </div>
              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">Last Name</div>
                <div className="text-[2vh]">Lastname</div>
              </div>
              <div className="flex-col">
                <div className="text-[2.5vh] font-medium text-slate-500">First Name</div>
                <div className="text-[2vh]">Firstname</div>
              </div>
            </div>

            <span className="text-[3vh] text-[#2F80ED]">Contact Details</span>
            <div className="grid grid-cols-2 gap-y-[2vh] px-[2vw] py-[2vh]">              
              <div className="flex-col">
                <div className="text-[2vh] font-medium text-slate-500">Phone Number</div>
                <div className="overflow-y-auto h-[15vh] py-[1vh] w-8/9">
                  <StepperList
                    list={[
                      "01234567891",
                      "01234567891",
                      "01234567891"
                    ]}
                  />

                </div>
              </div>
              <div className="flex-col">
                <div className="text-[2vh] font-medium text-slate-500">Email</div>
                <div className="overflow-y-auto h-[15vh] py-[1vh] w-8/9">
                  <StepperList
                    list={[
                      "averyverylongemailthatexceedswidth@email.com",
                      "email",
                      "email",
                      "email",
                      "email",
                      "email"
                    ]}
                  />
                </div>
              </div>
              
            </div>

            <div className="flex-col px-[2vw]">
                <div className="text-[2vh] font-medium text-slate-500">Facebook</div>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#2F80ED] underline text-[2vh]">
                  https://www.facebook.com
                </a>
                
              </div>
              <div className="flex-col px-[2vw] py-[1vh]">
                <div className="text-[2vh] font-medium text-slate-500">LinkedIn</div>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#2F80ED] underline text-[2vh]">
                  https://www.linkedin.com
                </a>
                
              </div>
            </div>

          <div className="px-[2vw] w-4/9">
              <span className="text-[3vh] text-[#2F80ED]">Address</span>
              
              <div className="px-[2vw] w-full">
                <div className="text-[2vh] font-medium text-slate-500 ">Country</div>
                <div className="text-[2vh]">Philippines</div>
                <div className="flex justify-between w-full mt-[1vh]">
                  <div className="flex-col w-1/2">
                    <div className="text-[2vh] font-medium text-slate-500 ">City</div>
                    <div className="text-[2vh]">Manila</div>
                  </div>
                  <div className="flex-col w-1/2">
                    <div className="text-[2vh] font-medium text-slate-500 ">State</div>
                    <div className="text-[2vh]">NCR</div>
                  </div>
                </div>
              </div>

              <span className="text-[3vh] text-[#2F80ED]">Occupation</span>
              <div className="px-[2vw] w-full">
                <div className="text-[2vh] font-medium text-slate-500 ">Role</div>
                <div className="text-[2vh]">Software Engineer</div>
              </div>

              <span className="text-[3vh] text-[#2F80ED]">Industry</span>
              <div className="px-[2vw] w-full">
                <div className="text-[2vh] font-medium text-slate-500 ">Field</div>
                <div className="text-[2vh]">Information Technology</div>
              </div>

              <span className="text-[3vh] text-[#2F80ED]">Company</span>
              <div className="px-[2vw] w-full my-[1vh]">
                <div className="text-[2vh] font-medium text-slate-500 ">Company Name</div>
                <div className="text-[2vh]">Company Name Here</div>
              </div>
              <div className="px-[2vw] w-full my-[1vh]">
                <div className="text-[2vh] font-medium text-slate-500 ">Website</div>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#2F80ED] underline text-[2vh]">
                  https://www.company.com
                </a>
              </div>
              <div className="px-[2vw] w-full my-[1vh]">
                <div className="text-[2vh] font-medium text-slate-500 ">Company Name</div>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#2F80ED] underline text-[2vh]">
                  https://www.linkedin.com
                </a>
              </div>
          </div>

          <button 
          //onclick
          className="flex text-[2.5vh] absolute right-[2vw] bottom-[2vh] h-[4vh] items-center cursor-pointer py-[0.5vh] px-[2vw] bg-gray-100 hover:bg-gray-400 rounded-full">
            Edit
          </button>

          </div>

        </div>

      </div>

    </>
    
    
  )
}

export default ViewPage