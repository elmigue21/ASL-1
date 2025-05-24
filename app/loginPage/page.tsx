"use client";
import React, { useState,useEffect } from "react";
// import { signIn } from "@/utils/auth";
import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/router";
import Image from 'next/image'
import { toast } from "sonner";
import useMediaQuery from '@/lib/hooks/useMediaQuery'

function LoginPage() {
  //  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("12345");
  const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
      // Clear profile when user arrives at login page
      localStorage.removeItem("profile");
    }, []);

const handleSubmit = async () => {
  try {
    setIsClicked(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 Required for sending/receiving cookies
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data.error || "Unknown error");
      toast.error(`Login failed: ${data.error}`  || "Unknown error")
      setIsClicked(false);
      return;
    }
    console.log('before local storage')
    localStorage.setItem("profile" ,JSON.stringify(data.profile));
    console.log('passed local storage')
    window.location.href = "/dashboardPage"; // Redirect here
    toast.success("Login Success!")
  } catch (error) {
    console.error("Network or unexpected error:", error);
    // alert("An unexpected error occurred. Please try again.");
    toast.error(`An error occured. ${error}`)
    setIsClicked(false);
  }
};
    const isMobile = useMediaQuery("(max-width: 767px)");

    return isMobile ? (
  <LoginMobile
    email={email}
    password={password}
    setEmail={setEmail}
    setPassword={setPassword}
    isClicked={isClicked}
    handleSubmit={handleSubmit}
  />
) : (
  <LoginDesktop
    email={email}
    password={password}
    setEmail={setEmail}
    setPassword={setPassword}
    isClicked={isClicked}
    handleSubmit={handleSubmit}
  />
);




  
}


function LoginMobile(props: {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isClicked: boolean;
  handleSubmit: () => void;
}) {
  const { email, password, setEmail, setPassword, isClicked, handleSubmit } = props;
return (
    <div className="relative h-screen">
      <div className="bg-[#1A3DB2] h-[4vh] w-full"></div>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-[#ECE2E2A3] flex flex-col items-center justify-start rounded-[0.56vw] p-[5vh] mt-[0.9vh] w-[90vw] h-[65vh]">
          <div className="flex items-center gap-x-[0.63vw] mt-[0.2vh] me-[2vw]">
            <div className="relative w-[25vw] h-[10.88vh]">
              <Image
                src="/dempaLogo.png"
                alt="Logo"
                fill
              />
            </div>
            <div className="relative h-[7vh] w-[50vw] mt-[2vh]">
              <Image
                src="/dempaLogoTxt.png"
                alt="Logo Text"
                fill
              />
            </div>
          </div>

          <div className="font-normal text-[7vw] mt-[2.6vh] ">
            LOGIN
          </div>
          <input
            type="text"
            className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[80vw] h-[7vh] my-[4.5vh] pl-[1.6vw] text-[5vw]"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[80vw] h-[7vh] pl-[1.6vw] text-[5vw]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-[#1A3DB2]  rounded-full flex items-center justify-center text-white hover:cursor-pointer xsm:w-[22.81vw] xsm:h-[6vh] xsm:text-[4vw] xsm:mt-[4vh] sm:w-[32.81vw] sm:h-[6vh] sm:text-[5vw] sm:mt-[6vh] md:w-[28.81vw] md:h-[5.5vh] md:text-[4vw] md:mt-[6vh] xl:w-[10.6vw] xl:h-[5.7vh] xl:text-[1.58vw] xl:mt-[9vh] active:scale-90 transition-all duration-300"
            disabled={isClicked}
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


function LoginDesktop(props: {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isClicked: boolean;
  handleSubmit: () => void;
}) {
  const { email, password, setEmail, setPassword, isClicked, handleSubmit } = props;
return (
    <div className="relative h-screen">
      <div className="bg-[#1A3DB2] h-[4vh] w-full"></div>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-[#ECE2E2A3] flex flex-col items-center justify-start rounded-[0.56vw] p-[5vh] mt-[0.9vh] w-[32vw] h-[75.8vh]">
          <div className="flex items-center gap-x-[0.63vw] mt-[0.2vh] me-[2vw]">
            <div className="relative w-[5.5vw] h-[11.88vh]">
              <Image
                src="/dempaLogo.png"
                alt="Logo"
                fill
              />
            </div>
            <div className="relative h-[9vh] w-[17vw] mt-[2vh]">
              <Image
                src="/dempaLogoTxt.png"
                alt="Logo Text"
                fill
              />
            </div>
          </div>

          <div className="font-normal text-[1.9vw] mt-[2.6vh] ">
            LOGIN
          </div>
          <input
            type="text"
            className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] my-[4.5vh] pl-[1.6vw] text-[1.58vw]"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] text-[1.58vw]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-[#1A3DB2]  rounded-full flex items-center justify-center text-white hover:cursor-pointer xsm:w-[22.81vw] xsm:h-[6vh] xsm:text-[4vw] xsm:mt-[4vh] sm:w-[32.81vw] sm:h-[6vh] sm:text-[5vw] sm:mt-[6vh] md:w-[28.81vw] md:h-[5.5vh] md:text-[4vw] md:mt-[6vh] xl:w-[10.6vw] xl:h-[5.7vh] xl:text-[1.58vw] xl:mt-[9vh] active:scale-90 transition-all duration-300"
            disabled={isClicked}
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
  


export default LoginPage;
