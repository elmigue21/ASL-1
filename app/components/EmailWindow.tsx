'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import { RootState
 } from '@/store/store';
 import { useState } from 'react';
 import { useSelector } from 'react-redux';
 import { useDispatch } from 'react-redux';
import { setOpenState } from '@/store/slices/emailWindowSlice';
// import { sendEmails } from './../../backend/controllers/emailController';
import { supabase } from '@/lib/supabase';
import {
  // addSelectedEmails,
  removeSelectedEmails,
} from "@/store/slices/subscriptionSlice";
import { Email } from '@/types/email';





function EmailWindow() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const openState = useSelector(
    (state: RootState) => state.EmailWindowSlice.isOpen
  );
  const dispatch = useDispatch();

  const closeClicked = () =>{
    dispatch(setOpenState(false));
  }

  const selectedEmails = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedEmails
  );


  const sendEmailsClicked = async () => {
 console.log(selectedEmails)
const emailIds = Array.isArray(selectedEmails) 
  ? selectedEmails.map((email) => email?.id).filter(Boolean) 
  : [];

    try{

          const { data: sessionData, /* error */ } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (!token) {
              return;
            }
      
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/email/sendEmails`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`, // ✅ Attach token in request
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                emailIds,
                emailSubject: message,
                emailText: subject,
                // emailHtml: "<a href=`https://www.youtube.com/watch?v=xvFZjo5PgG0`>test link</a>",
                fromName: "fname lname",
                // fromEmail: "",
              }),
            }
          );
          const data = await response.json()
          console.log(data);



    }catch(e){
      console.error(e)
    }
  } 

    const removeClicked = (email: Email) => {
      dispatch(removeSelectedEmails(email));
    };

  return openState && (
    <div className="fixed bottom-0 w-1/2 h-1/2 left-25 z-50 flex flex-col bg-slate-200 border-black border-2 rounded-t-2xl">
      <div className="justify-between w-full flex p-5 bg-sky-500 rounded-t-2xl">
        <h2>EMAIL WINDOW</h2>
        <h2 onClick={()=>{closeClicked()}}>X</h2>
      </div>
      <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex">
        {selectedEmails.map((email, index) => {
          return (
            <div
              key={index}
              className="bg-slate-500 rounded-3xl m-1 p-2 flex items-center justify-center"
            >
              {email.email}
              <p className="mx-2 hover:cursor-pointer hover:bg-white rounded-full" onClick={()=>{removeClicked(email)}}>
                X
              </p>
            </div>
          );
        })}
      </div>
      <Input
        placeholder="Subject..."
        className="border-1 border-black rounded-none"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
        }}
      />
      <Textarea
        placeholder="Message..."
        className="border-1 border-black flex-1 rounded-none"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <div className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-2" onClick={()=>{sendEmailsClicked()}}>
        SEND
      </div>
    </div>
  );
}

export default EmailWindow