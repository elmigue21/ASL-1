"use client";
import React from "react";
import Navbar from "../components/Navbar";
function editPage(){
return (
<>
    <Navbar />
    <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
        <div className="font-bold text-[#1E2E80] text-[1.60vw]">Edit Subscriber Account</div>
        <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl py-[6vh] px-[2.5vw]">
            <div className="text-[#2F80ED] text-[1vw]">Personal Information</div>
            <div className="flex flex-row gap-x-[10vw]">
                <div className="flex-col">
                    <div className="text-[0.85vw]">First Name <span className="text-red-600">*</span></div>
                    <div className="text-[0.85vw]"> <input type="text" className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Last Name</div>
                    <div className="text-[0.85vw]"> <input type="text" className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Phone Number</div>
                    <div className="text-[0.85vw]"> <input type="number" className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" required/></div>
                </div>
                {/* <div className="flex-col">
                    <div className="text-white">.</div>
                    <div className="border border-solid border-black h-auto w-auto text-center px-[0.3vw] rounded-[1vw]">+ Add Phone No.</div>
                </div> */}
            </div>
            <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

            <div className="flex flex-row gap-x-[10vw]">
                <div className="flex-col">
                    <div className="text-[0.85vw]">Email</div>
                    <div className="text-[0.85vw]"> <input type="text" className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Facebook URL</div>
                    <div className="text-[0.85vw]"> <input type="text" className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">LinkedIn URL</div>
                    <div className="text-[0.85vw]"> <input type="text" className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]" required/></div>
                </div>
            </div>
            <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

            <div className="text-[#2F80ED] text-[1vw]">Address</div>
            <div className="flex flex-row gap-x-[10vw]">
                <div className="flex-col">
                    <div className="text-[0.85vw]">Country</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] " required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">City</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required /></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Region</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required/></div>
                </div>
            </div>
            <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

            <div className="text-[#2F80ED] text-[1vw] flex flex-row gap-x-[35vw]">
                <div>Occupation</div>
                <div>Industry</div> 
            </div>
            
            <div className="flex flex-row gap-x-[10vw]">
                <div className="flex-col">
                    <div className="text-[0.85vw]">Role</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Field</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required/></div>
                </div>
            </div>
            <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>
            <div className="text-[#2F80ED] text-[1vw]">Company</div>
            <div className="flex flex-row gap-x-[10vw]">
                <div className="flex-col">
                    <div className="text-[0.85vw]">Company Name</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required/></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">Website</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required /></div>
                </div>
                <div className="flex-col">
                    <div className="text-[0.85vw]">LinkedIn URL</div>
                    <div className="text-[0.85vw]"> <input type="text" className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]" required/></div>
                </div>
            </div>

            <div className="bg-[#3AC31833] text-[1.2vw] h-[5vh] w-[7vw] rounded-[1.5vw] flex justify-center items-center absolute right-[11vw] mt-[4vh]">Edit</div>
        </div>
    </div>
  
  </>
  );
}
export default editPage;