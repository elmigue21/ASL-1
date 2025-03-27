import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import img from 'next/img'

export default function MyDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div  className='flex flex-row justify-center gap-x-6 cursor-pointer'>
                <Avatar className='h-13 w-13 object-cover'>
                <AvatarImage src="459776484_8051154088329475_5522794623496348150_n.jpg" alt="@shadcn" className='h-17 w-17'/>
                <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div style={{ fontFamily: 'Inter, sans-serif' }} className='items-center mt-2'>
                <h1 className='text-sm font-medium'>Miguel Caacbay</h1>
                <h1 className='text-xs'>Admin</h1>
                </div>
                <img src="down_arrow.png" alt="Inbox" className="w-5 h-5 items-center mt-3 -ml-2"/>
                </div>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Profile Clicked")}>Profile</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => console.log("Settings Clicked")}>Settings</DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => console.log("Logout Clicked")}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}