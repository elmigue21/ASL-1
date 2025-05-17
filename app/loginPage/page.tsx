"use client";
import React, { useState,useEffect } from "react";
import { signIn } from "@/utils/auth";
import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/router";
import Image from 'next/image'
import { toast } from "sonner";

function LoginPage() {
  //  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("12345");
  const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
      // Clear profile when user arrives at login page
      localStorage.removeItem("profile");
    }, []);
  // const handleSubmit = async () => {
  //   toast("Logging in...")
  //   try{
  //     setIsClicked(true);
      
  //   console.log("SUBMIT");
  //   const result = await signIn(username, password);
  //   console.log(result);
  //   const { data: sessionData } = await supabase.auth.getSession();
  //       const token = sessionData.session?.access_token;
  //       if (token) {
  //         document.cookie = `token=${token}; path=/; Secure; SameSite=Lax`;
  //          window.location.href = "/dashboardPage";
  //       }

  //       setIsClicked(false);

  //   }catch(e){
  //     console.error(e);
  //     setIsClicked(false);
  //   }
  // };

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

  return (
    <div className="relative h-screen">
      <div className="bg-[#1A3DB2] h-[4vh] w-full"></div>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-[#ECE2E2A3] flex flex-col items-center justify-start rounded-[0.56vw] p-[5vh] mt-[0.9vh] xsm:h-[60vh] xsm:w-[95.25vw] sm:w-[93.53vw] sm:h-[61.41vh] md:w-[65.73vw] md:h-[59.54vh] lg:mt-[-8vh] lg:w-[80.73vw] lg:h-[69.54vh] xl:w-[32vw] xl:h-[75.8vh] ">
          <div className="flex items-center gap-x-[0.63vw] mt-[0.2vh] me-[2vw]">
            <Image
              src="/dempaLogo.png"
              alt="Logo"
              // className="w-auto xsm:h-[10.88vh] xsm:ml-[-5vw] sm:h-[10.88vh] sm:ml-[-7vw] lg:h-[15vh] xl:h-[11.88vh] xl:ml-[0vw]"
              width={100}
              height={100}
            />
            <Image
              src="/dempaLogoTxt.png"
              alt="Logo Text"
              // className="h-[9vh] xsm:h-[6vh] sm:h-[5.6vh] lg:h-[7vh] xl:h-[7vh]"
              width={300}
              height={500}
            />
          </div>

          <div className="mt-[0vh] font-normal xsm:text-[5.5vw] sm:text-[6.5vw] md:text-[5vw] xl:text-[1.9vw] xl:mt-[2.6vh] ">
            LOGIN
          </div>
          <input
            type="text"
            className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] my-[4.5vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] xsm:my-[4vh] sm:w-[75vw] sm:h-[6.82vh] sm:text-[5vw] sm:my-[4vh] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] md:my-[5vh] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="bg-[#CFCECE] text-black border text-[1.58vw] p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] sm:w-[75vw] sm:h-[6.82vh] sm:text-[5vw] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
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
