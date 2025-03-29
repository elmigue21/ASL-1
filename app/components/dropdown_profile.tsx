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
        <div className="flex flex-row justify-center gap-x-6 cursor-pointer">
          <Avatar className="h-13 w-13 object-cover">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="h-17 w-17"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            className="items-center mt-2"
          >
            <h1 className="text-sm font-medium">User</h1>
            <h1 className="text-xs">Admin</h1>
          </div>
          <img
            src="down_arrow.png"
            alt="Inbox"
            className="w-5 h-5 items-center mt-3 -ml-2"
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