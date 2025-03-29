"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { signIn } from "@/utils/auth";
import { Button } from "@/components/ui/button";
function loginPage() {
  const [username, setUsername] = useState("user@example.com");
  const [password, setPassword] = useState("12345");

  const handleSubmit = async () => {
    try{
    console.log("SUBMIT");
    const result = await signIn(username, password);
    console.log(result);
    if(result != null){
      window.location.href= "/dashboardPage";
    }

    }catch(e){
      console.error(e);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="bg-[#1A3DB2] h-9 w-full"></div>

      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-[#ECE2E2A3] w-155 h-173 flex flex-col items-center justify-start text-xl rounded-lg p-7 mt-3">
          <div className="flex items-center gap-x-3 mt-1 me-10">
            <img src="dempaLogo.png" alt="Logo" className="h-25 w-25 " />
            <img src="dempaLogoTxt.png" alt="Logo Text" className="w-80 h-20" />
          </div>
          <div className="mt-10 text-4xl font-normal">LOGIN</div>

          <input
            type="text"
            className="bg-[#CFCECE] text-white border text-3xl border-gray-300 p-2 rounded-lg placeholder-white w-125 h-20 my-10 pl-8"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            className="bg-[#CFCECE] text-white border text-3xl border-gray-300 p-2 rounded-lg placeholder-white w-125 h-20 pl-8"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="flex flex-row gap-x-52 mt-5 tracking-wide">
            {/*shad*/}
            <div className="flex items-center gap-x-2">
              <Checkbox id="terms" className="bg-[#FFFFFF]" />
              <label
                htmlFor="terms"
                className="text-[#828282] text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <div className="text-[#686565] text-base font-medium">
              Forgot Password?
            </div>
          </div>

          <Button
          onClick={()=>{handleSubmit()}}
            className="bg-[#1A3DB2] w-50 h-13 rounded-full flex items-center justify-center text-white text-3xl mt-15 hover:cursor-pointer"
          >
            Login
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-48 p-4">
        <div className="fixed bottom-30 left-0 w-full h-10 bg-[#E85D04] p-2"></div>
        <div className="fixed bottom-20 left-0 w-full h-10 bg-[#DC2F02] p-2"></div>
        <div className="fixed bottom-10 left-0 w-full h-10 bg-[#D00000] p-2"></div>
        <div className=" fixed bottom-0 left-0 w-full h-10 bg-[#9D0208] p-2"></div>
      </div>
    </div>
  );
}

export default loginPage;
