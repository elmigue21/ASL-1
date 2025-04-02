"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from '../../lib/supabase';

function RegisPage() {
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
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("Google");
  const [companyLinkedIn, setCompanyLinkedIn] = useState("linkedin.com");
  const [companyWebsite, setCompanyWebsite] = useState("facebook.com");

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]); // Add an empty string for a new phone number
  };
  const addEmail = () => {
    setEmails([...emails, ""]); // Add an empty string for a new phone number
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phoneNumbers];
    updatedPhones[index] = value; // Update the specific phone number
    setPhoneNumbers(updatedPhones);
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value; // Update the specific phone number
    setEmails(updatedEmails);
  };

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

    
      const { data: sessionData, error } = await supabase.auth.getSession();
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
    console.log('POST DATA', data);

    console.log("Phone Numbers:", phoneNumbers);
    console.log("Emails:", emails);
  };

  return (
    <div>
      <Button
        onClick={() => {
          addPhoneNumber();
        }}
      >
        {" "}
        CLICK
      </Button>
      <Button
        onClick={() => {
          console.log("phones", phoneNumbers);
          console.log("emails", emails);
        }}
      >
        {" "}
        LOG PHONES
      </Button>
      <p>FIRST NAME</p>
      <Input
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
      ></Input>
      <p>LAST NAME</p>
      <Input
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
        }}
      ></Input>
      <p>LINKED IN URL</p>
      <Input
        value={personLinkedIn}
        onChange={(e) => {
          setPersonLinkedIn(e.target.value);
        }}
      ></Input>
      <p>FB URL</p>
      <Input></Input>

      <div className="bg-red-500 h-5"></div>

      <Button
        onClick={() => {
          addPhoneNumber();
        }}
      >
        ADD PHONE
      </Button>
      <Button
        onClick={() => {
          addEmail();
        }}
      >
        ADD EMAIL
      </Button>
      {phoneNumbers.map((phone, index) => (
        <div key={index}>
          <p>PHONE {index + 1}</p>
          <Input
            value={phone}
            onChange={(e) => handlePhoneChange(index, e.target.value)}
          ></Input>
        </div>
      ))}

      {emails.map((email, index) => (
        <div key={index}>
          <p>Email {index + 1}</p>
          <Input
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
          ></Input>
        </div>
      ))}

      <div className="bg-red-500 h-5"></div>

      <p>COUNTRY</p>
      <Input></Input>
      <p>STATE</p>
      <Input></Input>
      <p>CITY</p>
      <Input></Input>

      <div className="bg-red-500 h-5"></div>

      <p>OCCUPATION</p>
      <Input></Input>
      <p>INDUSTRY</p>
      <Input></Input>
      <p>COMPANY</p>
      <Input></Input>
      <p>COMPANY LINKED IN URL</p>
      <Input></Input>
      <p>COMPANY WEBSITE</p>
      <Input></Input>

      <Button
        onClick={() => {
          handleSubmit();
        }}
      >
        SUBMIT
      </Button>
    </div>
  );
}

export default RegisPage;
