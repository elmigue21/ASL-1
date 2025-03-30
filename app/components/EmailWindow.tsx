'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import { RootState
 } from '@/store/store';
 import { useState,useEffect } from 'react';
 import { useSelector } from 'react-redux';
 import { useDispatch } from 'react-redux';
import { setOpenState } from '@/store/slices/emailWindowSlice';




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

  const selectedSubscriptionIds = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedSubscriptionIds
  );
  return openState && (
    <div className="fixed bottom-0 w-1/2 h-1/2 left-25 z-50 flex flex-col bg-slate-200 border-black border-2 rounded-t-2xl">
      <div className="justify-between w-full flex p-5 bg-sky-500 rounded-t-2xl">
        <h2>EMAIL WINDOW</h2>
        <h2 onClick={()=>{closeClicked()}}>X</h2>
      </div>
      <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex">
        {selectedSubscriptionIds.map((email, index) => {
          return (
            <div
              key={index}
              className="bg-slate-500 rounded-3xl m-1 p-2 flex items-center justify-center"
            >
              {email.email}
              <p className="mx-2 hover:cursor-pointer hover:bg-white rounded-full">
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
      <div className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-2">
        SEND
      </div>
    </div>
  );
}

export default EmailWindow