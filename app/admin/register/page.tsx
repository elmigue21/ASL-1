"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import RoleGuard from "@/app/components/RoleGuard";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [firstName, setFirstName] = useState("")
  const [lastName,setLastName] = useState("")

  const handleSubmit = async () => {
    console.log('submitt')

     const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

     if(email == "" || password == "" || rePassword == "" || firstName == "" || lastName == ""){
        toast.error("Please fill all input fields");
        return;
     }

     if (!isEmailValid) {
       toast.error("Please enter a valid email address.");
       return;
     }

     if(password !== rePassword){
        toast.error("Passwords do not match")
     }

     try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         credentials:"include",
         body: JSON.stringify({ email, password, first_name:firstName, last_name:lastName }),
       });

       if (!response.ok) {
         const errorData = await response.json();
         toast.error(errorData.message || "Registration failed");
         return;
       }

      //  const data = await response.json();
       toast.success("Registration successful!");

       // Optionally do something after success, like redirect or clear form
       // e.g. navigate('/login');
     } catch (error) {
       console.error("Error during registration:", error);
       toast.error("An unexpected error occurred");
     }


  };

  return (
    // <RoleGuard>
      <div className="relative h-screen">
        <div className="bg-[#1A3DB2] h-[4vh] w-full"></div>
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-[#ECE2E2A3] flex flex-col items-center justify-start w-1/2 rounded-[0.56vw] p-10 mt-[0.9vh]  ">
            <div className="flex items-center gap-x-[0.63vw] mt-[0.2vh] me-[2vw]">
              <div className="relative w-[200px] h-[200px]">
                {" "}
                {/* adjust width/height for responsiveness */}
                <Image
                  src="/dempaLogo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-[350px] h-[150px]">
                {" "}
                {/* adjust width/height for responsiveness */}
                <Image
                  src="/dempaLogoTxt.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-[0vh] font-normal xsm:text-[5.5vw] sm:text-[6.5vw] md:text-[5vw] xl:text-[1.9vw] xl:mt-[2.6vh] ">
              REGISTER
            </div>
            <div className="flex flex-col justify-evenly gap-4 items-center w-1/2">
              <div className="flex">
                <input
                  placeholder="First Name"
                  className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <input
                  placeholder="Last Name"
                  className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </div>
              <input
                type="text"
                className="bg-[#CFCECE] text-black border p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
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
              <input
                type="password"
                className="bg-[#CFCECE] text-black border text-[1.58vw] p-[1vw] rounded-[0.56vw] placeholder-white w-[26vw] h-[9vh] pl-[1.6vw] xsm:w-[65vw] xsm:h-[5.82vh] xsm:text-[4vw] sm:w-[75vw] sm:h-[6.82vh] sm:text-[5vw] md:w-[55vw] md:h-[5.82vh] md:text-[4vw] lg:w-[63vw] lg:h-[8vh] xl:w-[26vw] xl:h-[9vh] xl:text-[1.58vw]"
                placeholder="Retype Password"
                value={rePassword}
                onChange={(e) => {
                  setRePassword(e.target.value);
                }}
              />
            </div>

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
    // </RoleGuard>
  );
};

export default RegisterPage;
