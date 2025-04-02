import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import img from 'next/img'
import Link from 'next/link'
import { logout } from "@/utils/auth";


export default function MyDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center gap-x-[1.1vw] cursor-pointer">
          <Avatar className="h-[5.8vh] w-[2.8vw] object-cover">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="w-[4vw] h-[6vh]"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            className="items-center mt-[0.6vh]"
          >
            <h1 className="text-[0.75vw] font-medium">User</h1>
            <h1 className="text-[0.63vw]">Admin</h1>
          </div>
          <img
            src="down_arrow.png"
            alt="Inbox"
            className="w-[2vw] h-[2.4vh] items-center mt-[1.3vh] -ml-[0.32vw]"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Profile Clicked")}>
          Profile
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => console.log("Settings Clicked")}>Settings</DropdownMenuItem> */}
        <Link href={"/"}>
          <DropdownMenuItem onClick={() => logout()}>
            Logout
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}