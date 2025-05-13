// import { Subscript } from 'lucide-react'
"use client";
import React, { useRef, useState, useEffect } from "react";
import Dropdown_Profile from "./dropdown_profile";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setOpenState } from "@/store/slices/emailWindowSlice";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Toaster } from "sonner";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const openClicked = () => {
    dispatch(setOpenState(true));
  
  };

  const router = useRouter();

  return (
    <div className="z-50">
      <div className="fixed left-0 top-0 h-[11vh] w-full bg-white text-black shadow-[0px_2px_10px_-3px_#000000] z-60 flex items-center px-4 overflow-hidden ">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`transition-all duration-100 ease-in-out overflow-hidden absolute left-0 top-0 h-[11vh] bg-[#1e2e80] z-50 flex justify-center items-center hover:bg-[#2a58ad] cursor-pointer
          ${isOpen ? "w-[15vw]" : "w-[5vw]"}`}
        >
          <img
            src="/menu-burger.png"
            alt="Hamburger Menu"
            className="w-[2vw] h-[1.7vw]"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <div
          className={`transition-all duration-100 ease-in-out overflow-hidden flex absolute items-center gap-[1vw] ${
            isOpen ? "left-[16vw]" : "left-[6vw]"
          }`}
        >
          <img
            src="/dempaLogo.png"
            alt="Logo"
            className="h-[8.9vh] w-[4.2vw]"
          />
          <img
            src="/dempaLogoTxt.png"
            alt="Logo Text"
            className="w-[8.2vw] h-[4.5vh]"
          />
        </div>

        <div className="flex absolute items-center w-auto right-[2vw]">
          <Dropdown_Profile></Dropdown_Profile>
        </div>
        <div
          style={{ fontFamily: "Inter, sans-serif" }}
          className={`fixed transition-all duration-100 ease-in-out overflow-hidden left-0 top-[11vh] h-full bg-[#1e2e80] text-white flex flex-col py-[5vh] z-50 text-[2vh] font-bold
              ${isOpen ? "w-[15vw]" : "w-[5vw]"}
              `}
        >
          <Link
            href="/dashboardPage"
            className="hover:scale-120 transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
            >
              {" "}
              <div>
                <img
                  src="/layout-fluid.png"
                  alt="Dashboard Icon"
                  className="h-[3.73vh]"
                />
              </div>
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="p-0 m-0">Dashboard</h2>
              </div>
            </div>
          </Link>
          <Link
            href="/tablesPage"
            className="hover:scale-120 transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
            >
              {" "}
              <img
                src="/table-layout.png"
                alt="Subscription Stats"
                className="h-[3.73vh] mt-[1.3vh]"
              />
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="items-center mt-[0.50vh]">Subscribers</h2>
              </div>
            </div>
          </Link>
          <Link
            href="/uploadPage"
            className="hover:scale-120 transition-all duration-300"
          >
            {" "}
            <div
              className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
            >
              {" "}
              <img
                src="/refresh.png"
                alt="User Update"
                className="h-[3.73vh]"
              />
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="items-center mt-[0.50vh]">Backups</h2>
              </div>
            </div>
          </Link>

          <Link
            href="/addAccPage"
            className="hover:scale-120 transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
            >
              {" "}
              <img
                src="/user-add.png"
                alt="Add Account"
                className="h-[3.73vh]"
              />
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="items-center mt-[0.50vh]">Add Subscriber</h2>
              </div>
            </div>{" "}
          </Link>
          <div>
            <hr className="border-t-[0.3vh] border-white my-[1.50vh] w-4/5 mx-auto opacity-50" />
          </div>
          <div
            className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] hover:scale-120 transition-all duration-300 hover:cursor-pointer ${
              isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
            }`}
          >
            {" "}
            <img src="/circle-user.png" alt="Account" className="h-[3.73vh]" />
            <div
              className={`transition-all duration-100 ease-in-out ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <h2 className="items-center mt-[0.50vh]">Account</h2>
            </div>
          </div>
          <div
            className={`items-center h-[10vh] w-full hover:bg-[#2a58ad] hover:scale-120 transition-all duration-300 hover:cursor-pointer ${
              isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
            }`}
            onClick={() => {
              openClicked();
            }}
          >
            {" "}
            <img
              src="/mail-plus-circle.png"
              alt="Inbox"
              className="h-[3.73vh]"
            />
            <div
              className={`transition-all duration-100 ease-in-out ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <h2 className="items-center mt-[0.50vh]">Email</h2>
            </div>
          </div>
          <div
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="transition-all duration-300 hover:cursor-pointer"
          >
            <div
              className={`mt-[9vh] items-center h-[10vh] w-full hover:bg-[#2a58ad] ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
            >
              {" "}
              <img src="/exit.png" alt="Inbox" className="h-[3.73vh]" />
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <h2 className="items-center mt-1">Log Out</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
