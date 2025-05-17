'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import img from 'next/img'
// import Link from 'next/link'
// import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { getName,getRole } from "@/utils/profileController";
import {useState,useEffect} from 'react'
import { logout } from "@/utils/profileController";
import Image from "next/image";


export default function Dropdown_Profile() {

  const router = useRouter();

  const [name,setName] = useState("")
  const [role,setRole] = useState("")
  
  useEffect(()=>{
    let fetchName = getName() ?? '';
    let fetchRole = getRole() ?? '';
    setName(fetchName);
    setRole(fetchRole);

  },[])
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center gap-x-[1.1vw] cursor-pointer items-center border border-slate-200 rounded-xl shadow p-3 hover:bg-slate-200 px-10">
          <Avatar className=" object-cover h-15 w-15">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            
          >
            <h1 className="font-bold">{name}</h1>
            <h1 className="">{role}</h1>
          </div>
          <Image
            src="/down_arrow.png"
            alt="profile menu"
            // className="h-[2.4vh] "
            height={20}
            width={20}

          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-60">
        <DropdownMenuItem onClick={() => console.log("Profile Clicked")} className="hover:cursor-pointer">
          Profile
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => console.log("Settings Clicked")}>Settings</DropdownMenuItem> */}
        <div>
          <DropdownMenuItem onClick={() => {logout(); router.replace("/")}} className="hover:cursor-pointer">
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}