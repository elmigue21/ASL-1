'use client'
import React, { useState } from 'react';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import EmailInputPopover from './EmailInputPopover';
import { Separator } from '@/components/ui/separator';
import CloseButton from './CloseButton';
import { toast } from 'sonner';
// import PhoneInputPopover from './PhoneInputPopover';
import { CountriesDropdown } from './CountriesDropdown';
type LandingPagePopupProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

type PersonForm = {
  firstName: string;
  lastName: string;
  // phoneInput: string;
  phoneNumbers: string[];
  // emailInput: string;
  emails: string[];
  facebook: string;
  linkedIn: string;
  country: string;
  city: string;
  state: string;
  occupation: string;
  industry: string;
  company: string;
  companyWebsite: string;
  companyLinkedIn: string;
};



const LandingPagePopup = ({ popupOpen, setPopupOpen }: LandingPagePopupProps) => {


const [formData, setFormData] = useState<PersonForm>({
  firstName: "",
  lastName: "",
  // phoneInput: "",
  phoneNumbers: [],
  // emailInput: "",
  emails: [],
  facebook: "",
  linkedIn: "",
  country: "",
  city: "",
  state: "",
  occupation: "",
  industry: "",
  company: "",
  companyWebsite: "",
  companyLinkedIn: "",
});

const handleChange = <K extends keyof PersonForm>(
  key: K,
  value: PersonForm[K]
) => {
  setFormData((prev) => ({ ...prev, [key]: value }));
};
const handlePhoneNumberChange = (value: string) => {
  if(value.length > 15) return;
  setFormData((prev) => ({
    ...prev,
    phoneNumbers: [value, ...prev.phoneNumbers.slice(1)],
  }));
};
const handleEmailChange = (value: string) => {
  
  setFormData((prev) => ({
    ...prev,
    emails: [value, ...prev.emails.slice(1)],
  }));
};

const handleCountrySelect = (value: string) => {
  setFormData((prev) => ({
    ...prev,
    country: value,
  }));
};



const handleSubmit = async () => {
  
// console.log(formData)
//   return;
  const {
    firstName,
    lastName,
    phoneNumbers,
    emails,
    facebook,
    linkedIn,
    country,
    city,
    state,
    occupation,
    industry,
    company,
    companyWebsite,
    companyLinkedIn,
  } = formData;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emails[0]);

    if (!isValidEmail) {
      console.log('not validd')
      toast.error("Please enter a valid email address.")
      return;
    }



  console.log('form data',formData)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/sendConfirmationEmail`, {
    method: "POST",
    credentials: "include", // This includes cookies in the request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      phoneNumbers,
      emails,
      facebook,
      linkedIn,
      country,
      city,
      state,
      occupation,
      industry,
      company,
      companyWebsite,
      companyLinkedIn

    }),
  });

  const data = await response.json();
  console.log(data);

  toast.success('Confirmation email sent!')
};


  if (!popupOpen) return null;

return (
  <div className="w-3/4 fixed h-3/4 gap-y-4 flex flex-col justify-center bg-white border border-black rounded-2xl z-50 p-5">
    <div className="">
      <h1 className="absolute top-5 left-5 font-bold text-[3vh] text-red-500">Subscribe</h1>
      <CloseButton
        onClick={() => {
          setPopupOpen(!popupOpen);
        }}
        className=""
      />
    </div>
    <div className="flex  justify-evenly gap-x-[3vw] px-[3vw]">
      <span className="flex-1">
        <Label htmlFor="firstname" className="p-1">
          First Name
        </Label>
        <Input
          id="firstname"
          className="border border-black"
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
      </span>
      <span className="flex-1">
        <Label htmlFor="lastname" className="p-1">
          Last Name
        </Label>
        <Input
          id="lastname"
          className="border border-black"
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
      </span>
      <span className="flex-1">
        <Label htmlFor="phone" className="p-1">
          Phone Number
        </Label>
        <Input
          id="phone"
          className="border border-black"
          type="number"
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
        />
      </span>

    </div>

    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-[3vw] px-[3vw]">
      <span className="flex-1">
        <Label htmlFor="email" className="p-1">
          Email
        </Label>
        <Input
          id="email"
          className="border border-black"
          value={formData.emails[0] || ""}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
      </span>
      <span className="flex-1">
        <Label htmlFor="facebookurl" className="p-1">
          Facebook URL
        </Label>
        <Input
          id="facebookurl"
          className="border border-black"
          onChange={(e) => handleChange("facebook", e.target.value)}
        />
      </span>
      <span className="flex-1">
        <Label htmlFor="linkedinurl" className="p-1">
          LinkedIn URL
        </Label>
        <Input
          id="linkedinurl"
          className="border border-black"
          onChange={(e) => handleChange("linkedIn", e.target.value)}
        />
      </span>
    </div>

    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-[3vw] px-[3vw]">
      <div className="flex-1">
        <Label htmlFor="country" className="p-1">
          Country
        </Label>
        <CountriesDropdown
          onSelectCountry={(value) => handleCountrySelect(value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="city" className="p-1">
          City
        </Label>
        <Input
          id="city"
          className="border border-black"
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="state" className="p-1">
          State
        </Label>
        <Input
          id="state"
          className="border border-black"
          onChange={(e) => handleChange("state", e.target.value)}
        />
      </div>
    </div>
    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-[3vw] px-[3vw]">
      <div className="flex-1">
        <Label htmlFor="occupation" className="p-1">
          Occupation
        </Label>
        <Input
          id="occupation"
          className="border border-black"
          onChange={(e) => handleChange("occupation", e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="industry" className="p-1">
          Industry
        </Label>
        <Input
          id="industry"
          className="border border-black"
          onChange={(e) => handleChange("industry", e.target.value)}
        />
      </div>
    </div>
    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-[3vw] px-[3vw]">
      <div className="flex-1">
        <Label htmlFor="companyname" className="p-1">
          Company Name
        </Label>
        <Input
          id="companyname"
          className="border border-black"
          onChange={(e) => handleChange("company", e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="companywebsite" className="p-1">
          Website
        </Label>
        <Input
          id="companywebsite"
          className="border border-black"
          onChange={(e) => handleChange("companyWebsite", e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="companylinkedin" className="p-1">
          Company LinkedIn
        </Label>
        <Input
          id="companylinkedin"
          className="border border-black"
          onChange={(e) => handleChange("companyLinkedIn", e.target.value)}
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button
        className="hover:cursor-pointer active:bg-slate-500 transition-all duration-300 active:scale-95"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </Button>
    </div>
  </div>
);


}

export default LandingPagePopup