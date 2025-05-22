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
import { getName,getRole ,getPfp} from "@/utils/profileController";
import {useState,useEffect} from 'react'
import { logout } from "@/utils/profileController";
import Image from "next/image";
import Link from "next/link";


export default function Dropdown_Profile() {

  const router = useRouter();

  const [name,setName] = useState("")
  const [role,setRole] = useState("")
  const [pfp,setPfp] = useState("")
  
  useEffect(()=>{
    let fetchName = getName() ?? '';
    let fetchRole = getRole() ?? '';
    let fetchPfp = getPfp() ?? '';
    setName(fetchName);
    setRole(fetchRole);
    setPfp(fetchPfp);

    console.log("PROFILE PICTURE",pfp)

  },[])
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center gap-x-[1.1vw] cursor-pointer items-center border border-slate-200 rounded-xl shadow p-3 hover:bg-slate-200 px-[2vw] h-[8vh] w-auto">
          <Avatar className=" object-cover h-[6vh] w-[3vw]">
            <AvatarImage
              src={pfp || "/user.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            className=""
            >
            <h1 className="font-bold text-[0.9vw]">{name}</h1>
            <h1 className="text-[0.9vw]">{role}</h1>
          </div>
          <div className="relative h-[2.4vh] w-[1.2vw]">
          <Image
            src="/down_arrow.png"
            alt="profile menu"
            fill
          />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-60">
            <Link href= "/accountSettings">
              <div>
                <DropdownMenuItem onClick={() => console.log("Profile Clicked")} className="hover:cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </div>
            </Link>
          
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