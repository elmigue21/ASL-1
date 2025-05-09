'use client'
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import EmailInputPopover from './EmailInputPopover';
import { Separator } from '@/components/ui/separator';
import CloseButton from './CloseButton';
import PhoneInputPopover from './PhoneInputPopover';
type LandingPagePopupProps = {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

type PersonForm = {
  firstName: string;
  lastName: string;
  phoneInput: string;
  phoneNumbers: string[];
  emailInput: string;
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

  if(!popupOpen) return null;
const [formData, setFormData] = useState<PersonForm>({
  firstName: "",
  lastName: "",
  phoneInput: "",
  phoneNumbers: [],
  emailInput: "",
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

const addPhoneNumber = (phone: string) => {
  setFormData((prev) => ({
    ...prev,
    phoneNumbers: [...prev.phoneNumbers, phone],
    phoneInput: "",
  }));
};

const removePhoneNumber = (index: number) => {
  setFormData((prev) => ({
    ...prev,
    phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
  }));
};

const addEmail = (email: string) => {
  setFormData((prev) => ({
    ...prev,
    emails: [...prev.emails, email],
    emailInput: "",
  }));
};

const removeEmail = (index: number) => {
  setFormData((prev) => ({
    ...prev,
    emails: prev.emails.filter((_, i) => i !== index),
  }));
};

const handleSubmit = () => {
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

  console.log({
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
  });
};
return (
  <div className="w-3/4 fixed h-3/4 gap-y-4 flex flex-col justify-center bg-white border border-black rounded-2xl z-50 p-5">
    <div className="flex justify-between items-center">
      <h1>Subscribe</h1>
      <CloseButton
        onClick={() => {
          setPopupOpen(!popupOpen);
        }}
      />
    </div>
    <div className="flex  justify-evenly gap-x-16 px-16">
      <span className="flex-1">
        <Label htmlFor="firstname" className="p-1">
          First Name
        </Label>
        <Input id="firstname" className="border border-black" />
      </span>
      <span className="flex-1">
        <Label htmlFor="lastname" className="p-1">
          Last Name
        </Label>
        <Input id="lastname" className="border border-black" />
      </span>

      <PhoneInputPopover
        phones={formData.phoneNumbers}
        removePhone={removePhoneNumber}
        // emailInput={formData.emailInput}
        // setEmailInput={formData.emailInput}
        addPhone={addPhoneNumber}
      />
    </div>

    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-16 px-16">
      <EmailInputPopover
        emails={formData.emails}
        removeEmail={removeEmail}
        // emailInput={formData.emailInput}
        // setEmailInput={formData.emailInput}
        addEmail={addEmail}
      />
      <span className="flex-1">
        <Label htmlFor="facebookurl" className="p-1">
          Facebook URL
        </Label>
        <Input id="facebookurl" className="border border-black" />
      </span>
      <span className="flex-1">
        <Label htmlFor="linkedinurl" className="p-1">
          LinkedIn URL
        </Label>
        <Input id="linkedinurl" className="border border-black" />
      </span>
    </div>

    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-16 px-16">
      <div className="flex-1">
        <Label htmlFor="country" className="p-1">
          Country
        </Label>
        <Input id="country" className="border border-black" />
      </div>
      <div className="flex-1">
        <Label htmlFor="city" className="p-1">
          City
        </Label>
        <Input id="city" className="border border-black" />
      </div>
      <div className="flex-1">
        <Label htmlFor="state" className="p-1">
          State
        </Label>
        <Input id="state" className="border border-black" />
      </div>
    </div>
    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-16 px-16">
      <div className="flex-1">
        <Label htmlFor="occupation" className="p-1">
          Occupation
        </Label>
        <Input id="occupation" className="border border-black" />
      </div>
      <div className="flex-1">
        <Label htmlFor="industry" className="p-1">
          Industry
        </Label>
        <Input id="industry" className="border border-black" />
      </div>
    </div>
    <Separator className="bg-black" />
    <div className="flex  justify-evenly gap-x-16 px-16">
      <div className="flex-1">
        <Label htmlFor="companyname" className="p-1">
          Company Name
        </Label>
        <Input id="companyname" className="border border-black" />
      </div>
      <div className="flex-1">
        <Label htmlFor="companywebsite" className="p-1">
          Website
        </Label>
        <Input id="companywebsite" className="border border-black" />
      </div>
      <div className="flex-1">
        <Label htmlFor="companylinkedin" className="p-1">
          Company LinkedIn
        </Label>
        <Input id="companylinkedin" className="border border-black" />
      </div>
    </div>
  </div>
);


}

export default LandingPagePopup