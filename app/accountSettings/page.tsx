"use client";
import React, { /* useRef, */ useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from '@/components/ui/button';
// import ChangePassword from "../components/ChangePassword";
import { ProfileUpdateDialog } from "./ProfileUpdateDialog";
import { NameUpdateDialog } from "./NameUpdateDialog";
import { ProfilePictureDialog } from "./ProfilePictureDialog";
import { getPfp ,getName} from "@/utils/profileController";

function Page() {
  const [pfp, setPfp] = useState("");
  const [name,setName] = useState("")
  useEffect(() => {
    const fetchPfp = getPfp() ?? "";
    const fetchName = getName() ?? "";
    setPfp(fetchPfp);
    setName(fetchName);
    console.log("PROFILE PICTURE", pfp);
  }, [pfp,name]);

  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/changePFP`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload success:", result);
      // TODO: update UI or notify user
    } catch (error) {
      console.error("Upload error:", error);
      // TODO: show error notification
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    console.log(" email loggg");
    console.log(newEmail);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/changeEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newEmail }),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data)
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeName = async (first_name: string, last_name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/changeName`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ first_name, last_name }),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data)
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh]">
        <div className="place-self-center">
          <div
            style={{ fontFamily: "Inter, sans-serif" }}
            className="items-center mt-2 relative w-8/9"
          >
            <div className="font-bold text-[#1E2E80] text-[1.60vw]">
              Account Settings
            </div>
          </div>
          <Card className="w-[25vw] h-[70vh] shadow-[0_50px_50px_20px_rgba(0,0,0,0.05) p-[1vw]">
            <div className="flex h-full w-full">
              <div className="w-[25vw] flex-vertical px-[1vw] ml-[1vw]">
                <ProfilePictureDialog
                  onConfirmAction={(file) => {
                    handleProfilePictureChange(file);
                  }}
                />

                <Avatar className="h-[15vh] w-[15vh] object-cover  rounded-full my-[4vh]">
                  <AvatarImage src={pfp || "/user.png"} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex gap-[1vw]">
                  <h2 className="text-[3vh] font-medium text-blue-900">Name</h2>
                  {/* <img
                    src="img\pen-square.png"
                    alt="Edit Button"
                    id="editAccName"
                    className="h-[2vh] self-center cursor-pointer hover:scale-110 hover:bg-[rgba(0,0,0,0.25)] rounded-[0.3vh]"
                  ></img> */}
                  <NameUpdateDialog
                    action={({ firstName, lastName }) => {
                      handleChangeName(firstName, lastName);
                    }}
                  />
                </div>
                <p className="text-[2.5vh] text-black ml-[1vw] text-wrap break-words">
                  {name}
                </p>
                <Separator className="my-3 w-[18vw] h-[0.3vh]" />

                <div className="flex gap-[1vw]">
                  <h2 className="text-[3vh] font-medium text-blue-900">
                    Email
                  </h2>
                  {/* <img
                    src="img\pen-square.png"
                    alt="Edit Button"
                    id="editAccEmail"
                    className="h-[2vh] self-center cursor-pointer hover:scale-110 hover:bg-[rgba(0,0,0,0.25)] rounded-[0.3vh]"
                  ></img> */}
                  <ProfileUpdateDialog
                    field="email"
                    label="Email"
                    placeholder="Input New Email"
                    action={(email) => {
                      handleEmailChange(email);
                    }}
                  />
                </div>
                <p className="text-[2.5vh] text-black ml-[1vw] text-wrap break-words">
                  user@email.com
                </p>
                <Separator className="my-3 w-[18vw] h-[0.3vh]" />
                <div className=" content-center mt-[5vh]">
                  <ProfileUpdateDialog
                    field="password"
                    label="password"
                    action={() => {
                      console.log("submit");
                    }}
                    retype
                    placeholder="Input password"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Page;
