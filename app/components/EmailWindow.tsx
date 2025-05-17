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
// import { supabase } from '@/lib/supabase';
import {
  // addSelectedEmails,
  removeSelectedEmails,
} from "@/store/slices/subscriptionSlice";
import { Email } from '@/types/email';
// import CloseButton from './CloseButton';
import Image from 'next/image'
import CloseButton from './CloseButton';
import { motion, AnimatePresence } from 'framer-motion'




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

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/email/sendEmails`,
            {
              method: "POST",
              headers: {
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

const variants = {
  hidden: { scale: 0, opacity: 0, originX: 1, originY: 1, x: "50%", y: "50%" },
  visible: {
    scale: 1,
    opacity: 1,
    x: 0,
    y: 0,
    originX: 1,
    originY: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    x: "50%",
    y: "50%",
    originX: 1,
    originY: 1,
    transition: { ease: "easeInOut" },
  },
};

  return (
    <AnimatePresence>
      {openState && (
        <motion.div
          className="fixed bottom-0 w-[45vw] top-[11vh] right-0 z-50 flex flex-col bg-white shadow-md shadow-gray-700/80"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          <div className="justify-between w-full flex p-[2vh] items-center">
            <div className="flex items-center">
              <Image
                src="/envelope-plus.png"
                alt="email icon"
                width={30}
                height={30}
              />
              <h1 className="text-lg font-medium">Send Email</h1>
            </div>
            <CloseButton onClick={closeClicked} />
          </div>
          <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex">
            {selectedEmails.map((email, index) => (
              <div
                key={index}
                className="bg-slate-500 rounded-3xl m-1 p-2 flex items-center justify-center"
              >
                {email.email}
                <p
                  className="mx-2 hover:cursor-pointer hover:bg-white rounded-full"
                  onClick={() => removeClicked(email)}
                >
                  X
                </p>
              </div>
            ))}
          </div>
          <Input
            placeholder="Subject..."
            className="border-1 border-black rounded-none"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Message..."
            className="border-1 border-black flex-1 rounded-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div
            className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-2 cursor-pointer select-none"
            onClick={sendEmailsClicked}
          >
            SEND
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EmailWindow