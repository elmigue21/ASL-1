"use client";
import React from "react";
// import Navbar from "../components/Navbar";
// import { supabase } from "@/lib/supabase";
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
import { toast } from "sonner";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Subscription } from "@/types/subscription";
import { toastError } from "@/utils/toastError";

interface FailedSubscription extends Subscription {
  reason: string;
}

interface AddAccProps {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  personLinkedIn: string;
  setPersonLinkedIn: React.Dispatch<React.SetStateAction<string>>;
  personFacebook: string;
  setPersonFacebook: React.Dispatch<React.SetStateAction<string>>;

  phoneNumbers: string[];
  setPhoneNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;

  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;

  occupation: string;
  setOccupation: React.Dispatch<React.SetStateAction<string>>;
  industry: string;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  companyLinkedIn: string;
  setCompanyLinkedIn: React.Dispatch<React.SetStateAction<string>>;
  companyWebsite: string;
  setCompanyWebsite: React.Dispatch<React.SetStateAction<string>>;

  phoneInput: string;
  setPhoneInput: React.Dispatch<React.SetStateAction<string>>;
  emailInput: string;
  setEmailInput: React.Dispatch<React.SetStateAction<string>>;

  addPhoneNumber: (val: string) => void;
  removePhoneNumber: (index: number) => void;
  addEmail: (val: string) => void;
  removeEmail: (index: number) => void;
  handleSubmit: () => void;
}

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

    try {
      // const { data: sessionData, error: sessionError } =
      //   await supabase.auth.getSession();
      // if (sessionError) {
      //   console.error("Session error:", sessionError);
      //   alert("Failed to retrieve session.");
      //   return;
      // }

      // const token = sessionData.session?.access_token;
      // if (!token) {
      //   alert("User is not authenticated.");
      //   return;
      // }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName,
            lastName,
            personLinkedIn,
            personFacebook,
            phoneNumbers,
            emails,
            country,
            state,
            city,
            occupation,
            industry,
            company,
            companyLinkedIn,
            companyWebsite,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("Failed to submit subscription. Please try again.");
        return;
      }

      const data = await response.json();
      console.log(data);
data.failedSubscriptions.forEach((failedSub : FailedSubscription) => {
  toastError({
    title: `Failed: ${failedSub.first_name} ${failedSub.last_name}`,
    description: failedSub.reason,
  });
});

      return data;
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile
    ? AddAccMobile({
        firstName,
        setFirstName,
        lastName,
        setLastName,
        personLinkedIn,
        setPersonLinkedIn,
        personFacebook,
        setPersonFacebook,
        phoneNumbers,
        setPhoneNumbers,
        emails,
        setEmails,
        country,
        setCountry,
        state,
        setState,
        city,
        setCity,
        occupation,
        setOccupation,
        industry,
        setIndustry,
        company,
        setCompany,
        companyLinkedIn,
        setCompanyLinkedIn,
        companyWebsite,
        setCompanyWebsite,
        phoneInput,
        setPhoneInput,
        emailInput,
        setEmailInput,
        addPhoneNumber,
        removePhoneNumber,
        addEmail,
        removeEmail,
        handleSubmit,
      })
    : AddAccDesktop({
        firstName,
        setFirstName,
        lastName,
        setLastName,
        personLinkedIn,
        setPersonLinkedIn,
        personFacebook,
        setPersonFacebook,
        phoneNumbers,
        setPhoneNumbers,
        emails,
        setEmails,
        country,
        setCountry,
        state,
        setState,
        city,
        setCity,
        occupation,
        setOccupation,
        industry,
        setIndustry,
        company,
        setCompany,
        companyLinkedIn,
        setCompanyLinkedIn,
        companyWebsite,
        setCompanyWebsite,
        phoneInput,
        setPhoneInput,
        emailInput,
        setEmailInput,
        addPhoneNumber,
        removePhoneNumber,
        addEmail,
        removeEmail,
        handleSubmit,
      });
}
function AddAccMobile({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  personLinkedIn,
  setPersonLinkedIn,
  personFacebook,
  setPersonFacebook,
  phoneNumbers,
  setPhoneNumbers,
  emails,
  setEmails,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  occupation,
  setOccupation,
  industry,
  setIndustry,
  company,
  setCompany,
  companyLinkedIn,
  setCompanyLinkedIn,
  companyWebsite,
  setCompanyWebsite,
  phoneInput,
  setPhoneInput,
  emailInput,
  setEmailInput,
  addPhoneNumber,
  removePhoneNumber,
  addEmail,
  removeEmail,
  handleSubmit,
}: AddAccProps) {
  return (
    <>
      {/* <Navbar /> */}
      <div className="z-45 absolute top-[9.5vh] w-full h-full">
        <div className="font-bold text-[#1E2E80] text-[6vw] flex justify-center mt-[2vh]">
          Create Subscription Account
        </div>
        <div className="w-full h-auto rounded-[0.60vw] shadow-2xl py-[2vh] px-[5vw] mb-[20vh] z-45">
          <div className="text-[#2F80ED] text-[5vw] ">Personal Information</div>
          <div className="flex flex-col gap-x-[10vw] gap-y-[2vh] pt-[2vh]">
            <div className="flex-col">
              <div className="text-[4vw]">
                First Name <span className="text-red-600">*</span>
              </div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-full text-[#121212] rounded-[0.40vw]"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">Last Name</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="border border-[rgba(0,0,0,0.4)] p-[1vw] h-[4vh] w-full text-[#121212] rounded-[0.40vw]"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">Phone Number</div>
              <div className="flex text-[4vw] gap-x-[2vw]">
                <Popover>
                  <div className="relative w-full">
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          value={phoneInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length > 15 || !/^\+?\d*$/.test(value)) {
                              return;
                            }
                            setPhoneInput(value);
                          }}
                          placeholder="Enter phone number"
                          className="pr-6 h-[4vh] w-[70vw] text-[4vw] border-[rgba(0,0,0,0.5)] border rounded-[0.4vw] p-[1vw]"
                          type="tel"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={15}
                        />
                        <PopoverTrigger asChild>
                          <div className="absolute top-1/2 right-[2vw] -translate-y-1/2 text-black cursor-pointer">
                            ▼
                          </div>
                        </PopoverTrigger>
                      </div>
                    </PopoverTrigger>
                  </div>

                  <PopoverContent className="w-[95vw] p-0 mx-[3vw]">
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
                  className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white w-[18vw] h-[4vh] text-[4vw]"
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
          <div>
            <hr className="border-t-[0.3vh] border-black my-[4vh] w-[80vw] mx-auto opacity-20" />
          </div>

          <div className="flex flex-col gap-x-[10vw] gap-y-[2vh]">
            <div className="flex-col">
              <div className="text-[4vw]">Email Address </div>

              <div className="flex text-[4vw] gap-x-[2vw]">
                <Popover>
                  <div className="relative w-full">
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                          }}
                          placeholder="Enter email"
                          className="pr-6 h-[4vh] w-[70vw] text-[4vw] border-[rgba(0,0,0,0.5)] border rounded-[0.4vw] p-[1vw]"
                        />
                        <PopoverTrigger asChild>
                          <div className="absolute top-1/2 right-[2vw] -translate-y-1/2 text-black cursor-pointer">
                            ▼
                          </div>
                        </PopoverTrigger>
                      </div>
                    </PopoverTrigger>
                  </div>

                  <PopoverContent className="w-[95vw] p-0 mx-[3vw]">
                    <ScrollArea className="h-[auto] w-full rounded-md border p-2">
                      <h4 className="text-sm font-semibold mb-2">EMAILS</h4>
                      <div className="space-y-1">
                        {emails.length > 0 ? (
                          emails.map((email, index) => (
                            <div
                              className="flex justify-between items-center"
                              key={index}
                            >
                              <div className="whitespace-nowrap max-w-[15vw]">
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
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (emailInput && emailPattern.test(emailInput)) {
                      addEmail(emailInput);
                      setEmailInput("");
                      toast("Email Added!", {
                        description: "qweqweqweqweqw",
                        style: {
                          border: "1px solid black", // Add border color
                          padding: "1rem", // Padding
                          color: "red", // Text color
                          fontWeight: "bold", // Font weight
                          fontSize: "1rem", // Optional font size
                        },
                      });
                    } else {
                      toast.error("Invalid email", {
                        description: "Please enter a valid email address",
                        style: {
                          backgroundColor: "red",
                          color: "white",
                        },
                      });
                    }
                  }}
                  className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white w-[18vw] h-[4vh] text-[4vw]"
                >
                  + Add
                </Button>
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">Facebook URL</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-full text-[#121212] rounded-[0.40vw] p-[1vw]"
                  required
                  value={personFacebook}
                  onChange={(e) => setPersonFacebook(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">LinkedIn URL</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-full text-[#121212] rounded-[0.40vw] p-[1vw]"
                  required
                  value={personLinkedIn}
                  onChange={(e) => setPersonLinkedIn(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <hr className="border-t-[0.3vh] border-black my-[4vh] w-[80vw] mx-auto opacity-20" />
          </div>
          <div className="text-[#2F80ED] text-[5vw]">Address</div>
          <div className="flex flex-col gap-x-[10vw] gap-y-[2vh]">
            <div className="flex-col">
              <div className="text-[4vw]">Country</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">City</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">State/Region</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <hr className="border-t-[0.3vh] border-black my-[4vh] w-[80vw] mx-auto opacity-20" />
          </div>

          <div className="text-[#2F80ED] text-[5vw] flex flex-row gap-x-[35vw]">
            <div>Occupation</div>
          </div>

          <div className="flex flex-col gap-x-[10vw] gap-y-[2vh]">
            <div className="flex-col">
              <div className="text-[4vw]">Role</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
            </div>
            <div className="text-[#2F80ED] text-[5vw] flex flex-row gap-x-[35vw]">
              <div>Industry</div>
            </div>
            <div className="flex-col">
              <div className="text-[4vw]">Field</div>
              <div className="text-[4vw]">
                {" "}
                <input
                  type="text"
                  className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>
            <div>
              <hr className="border-t-[0.3vh] border-black my-[4vh] w-[80vw] mx-auto opacity-20" />
            </div>
            <div className="text-[#2F80ED] text-[5vw]">Company</div>
            <div className="flex flex-col gap-x-[10vw] gap-y-[2vh]">
              <div className="flex-col">
                <div className="text-[4vw]">Company Name</div>
                <div className="text-[4vw]">
                  {" "}
                  <input
                    type="text"
                    className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-col">
                <div className="text-[4vw]">Website</div>
                <div className="text-[4vw]">
                  {" "}
                  <input
                    type="text"
                    className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                    required
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-col">
                <div className="text-[4vw]">LinkedIn URL</div>
                <div className="text-[4vw]">
                  {" "}
                  <input
                    type="text"
                    className="h-[4vh] w-full text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                    required
                    value={companyLinkedIn}
                    onChange={(e) => setCompanyLinkedIn(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="relative mt-[6vh] flex justify-end pr-[0vw]">
              <ConfirmDialog
                description="Are you sure"
                title="Add Account"
                onConfirmAction={handleSubmit}
              >
                <Button className="bg-[#000000] text-[4vw] h-[5vh] w-[18vw] rounded-[1.5vw] flex justify-center items-center">
                  Done
                </Button>
              </ConfirmDialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AddAccDesktop({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  personLinkedIn,
  setPersonLinkedIn,
  personFacebook,
  setPersonFacebook,
  phoneNumbers,
  setPhoneNumbers,
  emails,
  setEmails,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  occupation,
  setOccupation,
  industry,
  setIndustry,
  company,
  setCompany,
  companyLinkedIn,
  setCompanyLinkedIn,
  companyWebsite,
  setCompanyWebsite,
  phoneInput,
  setPhoneInput,
  emailInput,
  setEmailInput,
  addPhoneNumber,
  removePhoneNumber,
  addEmail,
  removeEmail,
  handleSubmit,
}: AddAccProps) {
  return (
    <>
      {/* <Navbar /> */}
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
              <div className="flex text-[0.85vw] gap-x-[0.5vw]">
                <Popover>
                  <div className="relative w-full">
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          value={phoneInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length > 15 || !/^\+?\d*$/.test(value)) {
                              return;
                            }
                            setPhoneInput(value);
                          }}
                          placeholder="Enter phone number"
                          className="pr-6 h-[4vh] w-[12vw] text-[0.9vw] border-[rgba(0,0,0,0.5)] border rounded-[0.4vw] p-[1vw]"
                          type="tel"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={15}
                        />
                        <PopoverTrigger asChild>
                          <div className="absolute top-1/2 right-[0.8vw] -translate-y-1/2 text-black cursor-pointer">
                            ▼
                          </div>
                        </PopoverTrigger>
                      </div>
                    </PopoverTrigger>
                  </div>

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
                  className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white w-[6vw] h-[4vh] text-[0.78vw]"
                >
                  + Add phone
                </Button>
              </div>
            </div>
          </div>
          <div>
            <hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" />
          </div>

          <div className="flex flex-row gap-x-[10vw]">
            <div className="flex-col">
              <div className="text-[0.85vw]">Email</div>

              <div className="text-[0.85vw] flex gap-x-[0.5vw]">
                <Popover>
                  <div className="relative w-full">
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                          }}
                          placeholder="Enter email"
                          className="pr-6 h-[4vh] w-[12vw] text-[0.9vw] border-[rgba(0,0,0,0.5)] border rounded-[0.4vw] p-[1vw]"
                        />
                        <PopoverTrigger asChild>
                          <div className="absolute top-1/2 right-[0.8vw] -translate-y-1/2 text-black cursor-pointer">
                            ▼
                          </div>
                        </PopoverTrigger>
                      </div>
                    </PopoverTrigger>
                  </div>

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
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (emailInput && emailPattern.test(emailInput)) {
                      addEmail(emailInput);
                      setEmailInput("");
                      toast("Email Added!", {
                        description: "qweqweqweqweqw",
                        style: {
                          border: "1px solid black", // Add border color
                          padding: "1rem", // Padding
                          color: "red", // Text color
                          fontWeight: "bold", // Font weight
                          fontSize: "1rem", // Optional font size
                        },
                      });
                    } else {
                      toast.error("Invalid email", {
                        description: "Please enter a valid email address",
                        style: {
                          backgroundColor: "red",
                          color: "white",
                        },
                      });
                    }
                  }}
                  className="bg-white text-black border-black border-1 rounded-[0.60vw] cursor-pointer hover:bg-white w-[6vw] h-[4vh] text-[0.78vw]"
                >
                  + Add Email
                </Button>
              </div>
            </div>
            <div className="flex-col">
              <div className="text-[0.85vw]">Facebook URL</div>
              <div className="text-[0.85vw]">
                {" "}
                <input
                  type="text"
                  className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] p-[1vw]"
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
                  className="border border-[rgba(0,0,0,0.4)] h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[30vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
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
                  className="h-[4vh] w-[18vw] text-[#121212] rounded-[0.40vw] border border-[rgba(0,0,0,0.4)] p-[1vw]"
                  required
                  value={companyLinkedIn}
                  onChange={(e) => setCompanyLinkedIn(e.target.value)}
                />
              </div>
            </div>
          </div>
          <ConfirmDialog
            description="Are you sure"
            title="Add Account"
            onConfirmAction={() => {
              handleSubmit();
            }}
          >
            <Button
              className="bg-[#000000] text-[1.2vw] h-[5vh] w-[7vw] rounded-[1.5vw] flex justify-center items-center absolute right-[11vw] mt-[6vh]"
              // onClick={() => {
              //   handleSubmit();
              // }}
            >
              Done
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </>
  );
}

export default AddAccPage;
