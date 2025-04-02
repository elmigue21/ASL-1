"use client";
import React from "react";
import Navbar from "../components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
// import { DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuItem,
//     DropdownMenuGroup,
//     DropdownMenuSub,
//     DropdownMenuSubContent,
//     DropdownMenuSubTrigger,
//     DropdownMenuPortal,
// } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area";
function AddAccPage(){

      const [firstName, setFirstName] = useState("Firsttt");
      const [lastName, setLastName] = useState("Lasttt");
      const [personLinkedIn, setPersonLinkedIn] = useState("linkedin.com");
      const [personFacebook, setPersonFacebook] = useState("facebook.com");
    
      const [phoneNumbers, setPhoneNumbers] = useState<string[]>([
        "12345",
        "232456",
      ]);
      const [emails, setEmails] = useState<string[]>([
        "example@gmail.com",
        "email@email.com",
      ]);
    
      const [country, setCountry] = useState("Philippines");
      const [state, setState] = useState("NCR");
      const [city, setCity] = useState("Manila");
    
      const [occupation, setOccupation] = useState("Developer");
      const [industry, setIndustry] = useState("TECH");
      const [company, setCompany] = useState("Google");
      const [companyLinkedIn, setCompanyLinkedIn] = useState("linkedin.com");
      const [companyWebsite, setCompanyWebsite] = useState("facebook.com");

      const [phoneInput,setPhoneInput] = useState("123124");
      const [emailInput,setEmailInput] = useState("email@123.com");
    
      const addPhoneNumber = (val:string) => {
        setPhoneNumbers([...phoneNumbers, val]); // Add an empty string for a new phone number
      };
      const addEmail = (val:string) => {
        setEmails([...emails, val]); // Add an empty string for a new phone number
      };
    
    //   const handlePhoneChange = (index: number, value: string) => {
    //     const updatedPhones = [...phoneNumbers];
    //     updatedPhones[index] = value; // Update the specific phone number
    //     setPhoneNumbers(updatedPhones);
    //   };
    
    //   const handleEmailChange = (index: number, value: string) => {
    //     const updatedEmails = [...emails];
    //     updatedEmails[index] = value; // Update the specific phone number
    //     setEmails(updatedEmails);
    //   };
    
      const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    
        if (phoneNumbers.some((phone) => phone.trim() === "")) {
          alert("Please fill all phone number fields.");
          return;
        }
    
        if (
          emails.some((email) => email.trim() === "" || !emailRegex.test(email))
        ) {
          alert("Please enter valid email addresses.");
          return;
        }
    
        
          const { data: sessionData, /* error */ } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;
          if (!token) {
            return;
          }
    
        console.log("submittt");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Attach token in request
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Your JSON payload goes here
              firstName: firstName,
              lastName: lastName,
              personLinkedIn:personLinkedIn,
              personFacebook: personFacebook,
    
              phoneNumbers:phoneNumbers,
              emails:emails,
    
              country:country,
              state:state,
              city:city,
              
              occupation:occupation,
              industry:industry,
              company:company,
              companyLinkedIn:companyLinkedIn,
              companyWebsite:companyWebsite,
            }),
          }
        );
    
        const data = await response.json();
        return data;
      };
    
return (
  <>
    <Navbar />
    <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh] px-[3vw] py-[2vh]">
      <div className="font-bold text-[#1E2E80] text-[1.60vw]">
        Create Subscription Account
      </div>
      <div className="w-auto h-[77vh] rounded-[0.60vw] shadow-2xl py-[6vh] px-[2.5vw]">
        <div className="text-[#2F80ED] text-[1vw]">Personal Information</div>
        <div className="flex flex-row gap-x-[10vw]">
          <div className="flex-col">
            <div className="text-[0.85vw]">
              First Name <span className="text-red-600">*</span>
            </div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">Last Name</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">Phone Number</div>
            <div className="flex">
              <Input
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                }}
              />
              <Button onClick={()=>{
                if(phoneInput){
                addPhoneNumber(phoneInput);
                setPhoneInput("");}}}>Add phone</Button>
            </div>

            <ScrollArea className="h-10 w-48 rounded-md border">
              <h4>NUMBERS</h4>
              <div>
                {phoneNumbers.map((phone, index) => (
                  <div className="flex justify-between mx-5" key={index}>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {phone}
                    </div>
                    <p className="hover:cursor-pointer">X</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          {/* <div className="flex-col">
                    <div className="text-white">.</div>
                    <div className="border border-solid border-black h-auto w-auto text-center px-[0.3vw] rounded-[1vw]">+ Add Phone No.</div>
                </div> */}
        </div>
        <div>
          <hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" />
        </div>

        <div className="flex flex-row gap-x-[10vw]">
          <div className="flex-col">
            <div className="text-[0.85vw]">Email</div>
            <div className="text-[0.85vw]">
              <div className="flex">
                <Input
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                  }}
                />
                <Button onClick={()=>{
                    if(emailInput){
                    addEmail(emailInput);
                     setEmailInput("");}}}>Add Email</Button>
              </div>
              <ScrollArea className="h-10 w-48 rounded-md border">
                <h4>NUMBERS</h4>
                <div>
                  {emails.map((email, index) => (
                    <div className="flex justify-between mx-5" key={index}>
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                        {email}
                      </div>
                      <p className="hover:cursor-pointer">X</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">Facebook URL</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]"
                required
                value={personFacebook}
                onChange={(e) => setPersonFacebook(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">LinkedIn URL</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw]"
                required
                value={personLinkedIn}
                onChange={(e) => setPersonLinkedIn(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" />
        </div>

        <div className="text-[#2F80ED] text-[1vw]">Address</div>
        <div className="flex flex-row gap-x-[10vw]">
          <div className="flex-col">
            <div className="text-[0.85vw]">Country</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] "
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">City</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">State/Region</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" />
        </div>

        <div className="text-[#2F80ED] text-[1vw] flex flex-row gap-x-[35vw]">
          <div>Occupation</div>
          <div>Industry</div>
        </div>

        <div className="flex flex-row gap-x-[10vw]">
          <div className="flex-col">
            <div className="text-[0.85vw]">Role</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">Field</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" />
        </div>
        <div className="text-[#2F80ED] text-[1vw]">Company</div>
        <div className="flex flex-row gap-x-[10vw]">
          <div className="flex-col">
            <div className="text-[0.85vw]">Company Name</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">Website</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col">
            <div className="text-[0.85vw]">LinkedIn URL</div>
            <div className="text-[0.85vw]">
              {" "}
              <input
                type="text"
                className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)]"
                required
                value={companyLinkedIn}
                onChange={(e) => setCompanyLinkedIn(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button className="bg-[#3AC31833] text-[1.2vw] h-[5vh] w-[7vw] rounded-[1.5vw] flex justify-center items-center absolute right-[11vw] mt-[4vh]"
        onClick={()=>{handleSubmit()}}
        >
          Done
        </Button>
      </div>
    </div>
  </>
);
}
export default AddAccPage;