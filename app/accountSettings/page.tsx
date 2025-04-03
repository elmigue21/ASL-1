import React from 'react'
import Navbar from "../components/Navbar";
import { Card} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import { Button } from '@/components/ui/button';
import ChangePassword  from "../components/ChangePassword";


function page() {
  return (
    <>
    <Navbar/>
    <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh]">
        <div className="place-self-center">
        <div style={{ fontFamily: "Inter, sans-serif" }} className="items-center mt-2 relative w-8/9">
            <h1 className="text-[6vh] font-medium text-blue-900 relative left-[2vw]">ACCOUNT SETTINGS</h1>
        </div>
        <Card className="w-[75vw] h-[70vh] shadow-[0_50px_50px_20px_rgba(0,0,0,0.05) p-[1vw]">
            <div className="flex h-full w-full">
              <div className="w-[20vw] flex-vertical px-[1vw]">
                
                <Avatar className="h-[15vh] w-[15vh] object-cover  rounded-full my-[4vh]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                
                
                <div className="flex gap-[1vw]">
                  <h2 className="text-[3vh] font-medium text-blue-900">Name</h2>
                  <img src="img\pen-square.png" alt="Edit Button" id="editAccName" className="h-[2vh] self-center cursor-pointer hover:scale-110 hover:bg-[rgba(0,0,0,0.25)] rounded-[0.3vh]"></img>
                </div>
                <p className="text-[2.5vh] text-black ml-[1vw] text-wrap break-words">User Name</p>
                <Separator className="my-3 w-[18vw] h-[0.3vh]"/>
                
                <div className="flex gap-[1vw]">
                  <h2 className="text-[3vh] font-medium text-blue-900">Email</h2>
                  <img src="img\pen-square.png" alt="Edit Button" id="editAccEmail" className="h-[2vh] self-center cursor-pointer hover:scale-110 hover:bg-[rgba(0,0,0,0.25)] rounded-[0.3vh]"></img>
                </div>
                <p className="text-[2.5vh] text-black ml-[1vw] text-wrap break-words">user@email.com</p>
              </div>

              <Separator orientation="vertical" className="mx-3 w-[0.1vw]"/>

              <div className="h-full w-full content-center">
              <ChangePassword widthPercentage={25}/>
              </div>
              
            </div>
            
        </Card>
        </div>
    </div>
    </>
  )
}

export default page