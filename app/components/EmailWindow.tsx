import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';


let emails = [
  { email: "user@example.com" },
  { email: "guelcaac@gmail.com" },
  { email: "random@email.com" },
  { email: "qweqweqwe@fdf.com" },
  { email: "qweqweqwe@fdf.com" },
  { email: "qweqweqwe@fdf.com" },
  { email: "qweqweqwe@fdf.com" },
];


function EmailWindow() {
  return (
    <div
     className="fixed bottom-0 w-1/2 h-1/2 left-25 z-50 flex flex-col bg-slate-200 border-black border-2 rounded-t-2xl">
      <div className="justify-between w-full flex p-5 bg-sky-500 rounded-t-2xl">
        <h2>EMAIL WINDOW</h2>
        <h2>X</h2>
      </div>
      <div className="overflow-x-auto overflow-y-clip whitespace-nowrap gap-2 h-15 touch-auto flex">
        {emails.map((email)=>{
            return(<div className="bg-slate-500 rounded-3xl m-1 p-2 flex items-center justify-center">{email.email}<p className="mx-2 hover:cursor-pointer hover:bg-white rounded-full">X</p></div>)
        })}
      </div>
      <Input
        placeholder="Subject..."
        className="border-1 border-black rounded-none"
      />
      <Textarea
        placeholder="Subject..."
        className="border-1 border-black flex-1 rounded-none"
      />
    </div>
  );
}

export default EmailWindow