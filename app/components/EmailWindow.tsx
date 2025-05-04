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
    <div className="fixed bottom-0 w-[45vw] top-[11vh] right-0 z-50 flex flex-col bg-white shadow-md shadow-gray-700/80">
      <div className="justify-between w-full flex p-[2vh] items-center">
        <div className='flex items-center'>
          <img className="scale-50" src="envelope-plus.png" alt="email icon"/>
          <h1 className="text-lg font-medium">Send Email</h1>
        </div>
         
        <button className="group relative flex items-center justify-center cursor-pointer w-fit h-fit" onClick={()=>{closeClicked()}}>
          <img src="rectangle-xmark.png" alt="" className="scale-50 block group-hover:hidden"/>
          <img src="rectangle-xmark-red.png" alt="" className="scale-50 hidden group-hover:block"/>
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex border-y-2 ">
        {selectedEmails.map((email, index) => {
          return (
            <div
              key={index}
              className="bg-green-200 rounded-3xl m-2 p-2 flex items-center justify-center w-fit max-w-xs"
            >
             <span className='truncate'>{email.email}</span> 
              
              <button className="group relative flex items-center justify-center cursor-pointer " onClick={()=>{removeClicked(email)}}>
                <img src="circle-xmark.png" alt="" className="scale-50 block group-hover:hidden"/>
                <img src="circle-xmark-fill-red.png" alt="" className="scale-50 hidden group-hover:block"/>
              </button>
              
            </div>
          );
        })}
      </div>
      <Input
        placeholder="Subject..."
        className="border-0 rounded-none"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
        }}
      />
      <Textarea
        placeholder="Message..."
        className="border-1 border-y-2 flex-1 rounded-none"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <div className="absolute bottom-5 right-5 bg-[color:#1E2E80] text-white rounded-full py-2 px-4 font-medium" onClick={()=>{sendEmailsClicked()}}>
        SEND
      </div>
    </div>
  );
}

export default EmailWindow