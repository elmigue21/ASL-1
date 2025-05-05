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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function AddAccPage() {
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

  const [phoneInput, setPhoneInput] = useState("123124");
  const [emailInput, setEmailInput] = useState("email@123.com");

  const addPhoneNumber = (val: string) => {
    setPhoneNumbers([...phoneNumbers, val]); // Add an empty string for a new phone number
  };
  const addEmail = (val: string) => {
    setEmails([...emails, val]); // Add an empty string for a new phone number
  };

  const removePhoneNumber = (indexToRemove: number) => {
    setPhoneNumbers((prevPhones) =>
      prevPhones.filter((_, index) => index !== indexToRemove)
    );
  };

  const removeEmail = (indexToRemove: number) => {
    setEmails((prevEmails) =>
      prevEmails.filter((_, index) => index !== indexToRemove)
    );
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

    const { data: sessionData /* error */ } = await supabase.auth.getSession();
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
          personLinkedIn: personLinkedIn,
          personFacebook: personFacebook,

          phoneNumbers: phoneNumbers,
          emails: emails,

          country: country,
          state: state,
          city: city,

          occupation: occupation,
          industry: industry,
          company: company,
          companyLinkedIn: companyLinkedIn,
          companyWebsite: companyWebsite,
        }),
      }
    );

    const data = await response.json();
    return data;
  };

  return (
    <>
      <Navbar />
      <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[88vh] px-[3vw] py-[2vh] overflow-hidden">
        <div className="font-bold text-[#1E2E80] text-[1.60vw]">
          Create Subscription Account
        </div>
        <div className="w-auto h-[80vh] rounded-[0.60vw] shadow-2xl py-[6vh] px-[2.5vw] mb-[20vh] z-45">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative w-full">
                      <Input
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Enter phone number"
                        className="pr-6"
                      />
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 cursor-pointer">
                        ▼
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[12vw] p-0">
                    <ScrollArea className="h-auto w-full rounded-md border p-2">
                      <h4 className="text-sm font-semibold mb-2">NUMBERS</h4>
                      <div className="space-y-1">
                        {phoneNumbers.length > 0 ? (
                          phoneNumbers.map((phone, index) => (
                            <div
                              className="flex justify-between items-center"
                              key={index}
                            >
                              <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                {phone}
                              </div>
                              <p
                                className="text-red-500 hover:cursor-pointer"
                                onClick={() => removePhoneNumber(index)}
                              >
                                X
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">
                            No numbers added
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>

                <Button
                  onClick={() => {
                    if (phoneInput) {
                      addPhoneNumber(phoneInput);
                      setPhoneInput("");
                    }
                  }}
                  className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white"
                >
                  + Add phone
                </Button>
              </div>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <Input
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                          }}
                          placeholder="Enter email"
                          className="pr-6 h-[4vh] w-[12vw]"
                        />
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-black cursor-pointer">
                          ▼
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[15vw] p-0">
                      <ScrollArea className="h-[auto] w-full rounded-md border p-2">
                        <h4 className="text-sm font-semibold mb-2">EMAILS</h4>
                        <div className="space-y-1">
                          {emails.length > 0 ? (
                            emails.map((email, index) => (
                              <div
                                className="flex justify-between items-center"
                                key={index}
                              >
                                <div className="whitespace-nowrap overflow-hidden max-w-[15vw]">
                                  {email}
                                </div>
                                <p
                                  className="text-red-500 hover:cursor-pointer"
                                  onClick={() => removeEmail(index)}
                                >
                                  X
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm">
                              No emails added
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() => {
                      if (emailInput) {
                        addEmail(emailInput);
                        setEmailInput("");
                      }
                    }}
                    className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white"
                  >
                    + Add Email
                  </Button>
                </div>
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

          <Button
            className="bg-[#000000] text-[1.2vw] h-[5vh] w-[7vw] rounded-[1.5vw] flex justify-center items-center absolute right-[11vw] mt-[6vh]"
            onClick={() => {
              handleSubmit();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
export default AddAccPage;
