"use client";
import React, { useState } from "react";
import { signIn } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase";
import { useRouter } from "next/router";

function loginPage() {
  //  const router = useRouter();
  const [username, setUsername] = useState("user@example.com");
  const [password, setPassword] = useState("12345");
  const handleSubmit = async () => {
    try{
    console.log("SUBMIT");
    const result = await signIn(username, password);
    console.log(result);
    const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (token) {
          document.cookie = `token=${token}; path=/; Secure; SameSite=Lax`;
           window.location.href = "/dashboardPage";
        }



    }catch(e){
      console.error(e);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="bg-[#1A3DB2] h-[4vh] w-full"></div>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-[#ECE2E2A3] w-[32vw] h-[75.8vh] flex flex-col items-center justify-start rounded-[0.56vw] p-[5vh] mt-[0.9vh]">
          <div className="flex items-center gap-x-[0.63vw] mt-[0.2vh] me-[2vw]">
            <img src="dempaLogo.png" alt="Logo" className="h-[10.88vh] w-[5.2vw] " />
            <img src="dempaLogoTxt.png" alt="Logo Text" className="w-[16.8vw] h-[9vh]" />
          </div>
          <div className="mt-[4vh] text-[1.9vw] font-normal">LOGIN</div>
          <input
            type="text"
            className="bg-[#CFCECE] text-black border text-[1.58vw] p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] my-[4.5vh] pl-[1.6vw]"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            className="bg-[#CFCECE] text-black border text-[1.58vw] p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw]"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {/* <div className="flex flex-row gap-x-52 mt-5 tracking-wide"> */}
            {/*shad*/}
            {/* <div className="flex items-center gap-x-2">
              <Checkbox id="terms" className="bg-[#FFFFFF]" />
              <label
                htmlFor="terms"
                className="text-[#828282] text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div> */}
            {/* <div className="text-[#686565] text-base font-medium">
              Forgot Password?
            </div> */}
          {/* </div> */}

          <Button
          onClick={()=>{handleSubmit()}}
            className="bg-[#1A3DB2] w-[10.6vw] h-[5.7vh] rounded-full flex items-center justify-center text-white text-[1.58vw] mt-[9vh] hover:cursor-pointer"
          >
            Login
          </Button>
        </div>
      </div>


        <div className="absolute bottom-[13.2vh] left-0 w-full h-[4.4vh] bg-[#E85D04]"></div>
        <div className="absolute bottom-[8.8vh] left-0 w-full h-[4.4vh] bg-[#DC2F02]"></div>
        <div className="absolute bottom-[4.4vh] left-0 w-full h-[4.4vh] bg-[#D00000]"></div>
        <div className=" absolute bottom-0 left-0 w-full h-[4.4vh] bg-[#9D0208]"></div>
      </div>
  );
}

export default loginPage;
