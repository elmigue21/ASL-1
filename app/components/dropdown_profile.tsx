import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import img from 'next/img'
import Link from 'next/link'
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";


export default function Dropdown_Profile() {

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center gap-x-[1.1vw] cursor-pointer items-center">
          <Avatar className="h-[5.8vh] w-[2.8vw] object-cover">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            
          >
            <h1 className="text-[0.75vw] font-medium">User</h1>
            <h1 className="text-[0.63vw]">Admin</h1>
          </div>
          <img
            src="/down_arrow.png"
            alt="profile menu"
            className="h-[2.4vh] "
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-60">
        <DropdownMenuItem onClick={() => console.log("Profile Clicked")}>
          Profile
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => console.log("Settings Clicked")}>Settings</DropdownMenuItem> */}
        <div>
          <DropdownMenuItem onClick={() => {logout(); router.replace("/")}}>
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}