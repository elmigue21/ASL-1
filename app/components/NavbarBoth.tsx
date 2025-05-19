"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import useMediaQuery from "@/lib/hooks/useMediaQuery";
import Dropdown_Profile from "./dropdown_profile";
import { logout } from "@/utils/auth";
import { setOpenState } from "@/store/slices/emailWindowSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { ConfirmDialog } from "./ConfirmDialog";

const NavbarBoth = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const pathname = usePathname();

  // Return nothing on specific routes
  if (
    pathname === "/loginPage" ||
    pathname === "/" ||
    pathname === "/confirm" /* || pathname === "/unauthorized" */
  ) {
    return null;
  }

  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
};

const NavbarMobile = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false); // Stop spinning after the animation duration (e.g., 0.6s)
    }, 600); // 600ms should match the duration of your spin animation
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: "layout-fluid",
      link: "/dashboardPage",
    },
    {
      label: "Subscriptions",
      icon: "table-layout",
      link: "/tablesPage",
    },
    {
      label: "Backups/Reports",
      icon: "refresh",
      link: "/uploadPage",
    },
    {
      label: "Create Subs",
      icon: "user-add",
      link: "/addAccPage",
    },
  ];

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: expanded ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-green-500 absolute top-0 left-0 z-[100] overflow-hidden md:hidden block"
        style={{ pointerEvents: expanded ? "auto" : "none" }}
      >
        <div className="flex flex-col h-[calc(100vh-64px)] mt-[64px] md:hidden">
          {navItems.map((nav, index) => {
            return (
              <Link
                className="flex flex-col items-center justify-center h-16 bg-blue-500 text-white flex-1"
                key={index}
                href={nav.link}
                onClick={()=>{setExpanded(false)}}
              >
                <div className="relative w-6 h-6 mr-2">
                  {" "}
                  {/* Wrapper div for Image to ensure correct layout */}
                  <Image
                    src={`/${nav.icon}.png`}
                    alt={nav.label}
                    layout="fill" // Fill the parent div (w-6 h-6)
                    objectFit="contain" // Make sure image maintains aspect ratio
                  />
                </div>
                <span>{nav.label}</span>
              </Link>
            );
          })}
          <div
            className="flex flex-col items-center justify-center h-16 bg-blue-500 text-white flex-1"
            onClick={() => {
              logout();
              setExpanded(false);
              router.replace("/loginPage");
            }}
          >
            <div className="relative w-6 h-6 mr-2">
              {" "}
              {/* Wrapper div for Image to ensure correct layout */}
              <Image
                src={`/exit.png`}
                alt="logout"
                layout="fill" // Fill the parent div (w-6 h-6)
                objectFit="contain" // Make sure image maintains aspect ratio
              />
            </div>
            <span>Logout</span>
          </div>
        </div>
      </motion.div>

      <div className="fixed top-0 h-16 bg-red-500 md:hidden w-full z-[100] flex justify-between">
        <Image
          src="/img/dempaLogoTxt.png"
          width={500} // No fixed width
          height={100} // Set a height to maintain aspect ratio
          alt="logo"
          layout="intrinsic"
          style={{ width: "auto" }} // Make the width flexible based on the content's natural size
        />

        <button
          onClick={() => {
            setExpanded(!expanded);
            handleClick();
          }}
          className="flex justify-center items-center w-16 h-16 bg-blue-500 text-white rounded active:scale-150 transition-all duration-300"
        >
          <motion.div
            className="relative w-8 h-8 flex items-center justify-center"
            initial={{ opacity: 0, rotate: 0, scale: 1 }}
            animate={{
              opacity: 1,
              rotate: expanded ? 360 : 0, // Rotate 180 degrees when expanded
              scale: isSpinning ? 1.2 : 1, // Shrink when expanded, grow back when collapsed
            }}
            transition={{
              duration: 0.3,
              ease: "easeIn", // Smooth easing for the transitions
            }}
          >
            <Image
              src={expanded ? "/circle-xmark.png" : "/menu-burger.png"} // Swap the image source based on state
              alt={expanded ? "Close Menu" : "Open Menu"}
              className="w-6 h-6"
              width={30}
              height={30}
            />
          </motion.div>
        </button>

      </div>
    </>
  );
};

const NavbarDesktop: React.FC = () => {
  //   const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const openState = useSelector(
    (state: RootState) => state.EmailWindowSlice.isOpen
  );
  const mailClicked = () => {
    dispatch(setOpenState(!openState));
  };
  // const dispatch = useDispatch();

  const closeClicked = () => {
    dispatch(setOpenState(!openState));
  };

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="z-50 xsm:hidden md:block">
      <div className="fixed left-0 top-0 h-[11vh] w-full bg-white text-black shadow-[0px_2px_10px_-3px_#000000] z-60 flex items-center px-4 overflow-hidden transition-all">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`transition-all duration-100 ease-in-out 
            overflow-hidden absolute left-0 top-0 h-[11vh] bg-[#1e2e80] z-50 flex justify-center
             items-center hover:bg-[#2a58ad] cursor-pointer 
          ${isOpen ? "w-[15vw]" : "w-[5vw]"}`}
        >
           <div className="relative w-[2vw] h-[1.7vw]">
            <Image
              src="/menu-burger.png"
              alt="Hamburger Menu"
              onClick={() => setIsOpen(!isOpen)}
              fill
              className="object-contain cursor-pointer"
            />
          </div>
        </div>
        <div
          className={`transition-all duration-100 ease-in-out overflow-hidden flex absolute items-center gap-[1vw] ${
            isOpen ? "left-[16vw]" : "left-[6vw]"
          }`}
        >
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block" }}
          >
            <div className="relative h-[8.9vh] w-[4.2vw]">
              <Image src="/dempaLogo.png" alt="Logo" fill />
            </div>
          </motion.div>
          <div className="relative w-[8.7vw] h-[5vh]">
            <Image
            src="/dempaLogoTxt.png"
            alt="Logo Text"
            fill
          />
          </div>
          
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
            className="hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              } ${
                pathname === "/dashboardPage" ? "bg-blue-500" : ""
              } active:scale-120 rounded-md transition-all duration-300`}
            >
              {" "}
              <div className=" relative h-[3.73vh] w-[1.8vw]">
                <Image
                  src="/layout-fluid.png"
                  alt="Dashboard Icon"
                  fill
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
            prefetch={true}
            className="hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              } ${
                pathname === "/tablesPage" ? "bg-blue-500" : ""
              } active:scale-120 rounded-md transition-all duration-300`}
            >
              {" "}
              <div className=" relative h-[3.73vh] w-[1.8vw]">
              <Image
                src="/table-layout.png"
                alt="Subscription Stats"
                fill
              /></div>
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
            prefetch={true}
            className="hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300"
          >
            {" "}
            <div
              className={`items-center h-[10vh] w-full ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              } ${
                pathname === "/uploadPage" ? "bg-blue-500" : ""
              } active:scale-120 rounded-md transition-all duration-300`}
            >
              {" "}
              <div className=" relative h-[3.73vh] w-[1.8vw]">
              <Image
                src="/refresh.png"
                alt="User Update"
                fill
              /></div>
              <div
                className={`transition-all duration-100 ease-in-out ${
                  isOpen ? "block" : "hidden"
                } ${
                  pathname === "/uploadPage" ? "bg-blue-500" : ""
                } active:scale-120 rounded-md transition-all duration-300`}
              >
                <h2 className="items-center mt-[0.50vh]">Backups</h2>
              </div>
            </div>
          </Link>

          <Link
            href="/addAccPage"
            className="hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300"
          >
            <div
              className={`items-center h-[10vh] w-full ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              } ${
                pathname === "/addAccPage" ? "bg-blue-500" : ""
              } active:scale-120 rounded-md transition-all duration-300`}
            >
              {" "}
              <div className=" relative h-[3.73vh] w-[1.8vw]">
              <Image
                src="/user-add.png"
                alt="Add Account"
                fill
              /></div>
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
            className={`items-center h-[10vh] w-full hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300 hover:cursor-pointer ${
              isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
            }`}
          >
            {" "}
            <div className=" relative h-[3.73vh] w-[1.8vw]">
            <Image
              src="/circle-user.png"
              alt="Account"
              fill
            /></div>
            <div
              className={`transition-all duration-100 ease-in-out ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <h2 className="items-center mt-[0.50vh]">Account</h2>
            </div>
          </div>
          <div
            className={`items-center h-[10vh] w-full hover:scale-80 rounded-xl hover:bg-[#2a58ad] transition-all duration-300 hover:cursor-pointer ${
              isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
            } `}
            onClick={() => {
              mailClicked();
            }}
          >
            {" "}
            <div
              className={`w-10 h-10 flex items-center justify-center ${
                openState ? "bg-blue-500 rounded-full" : ""
              } inline-block transition-all duration-300 p-2`}
            >
              <div className=" relative h-[3.73vh] w-[1.8vw]">
              <Image
                src="/mail-plus-circle.png"
                alt="Inbox"
                fill
              /></div>
            </div>
            <div
              className={`transition-all duration-100 ease-in-out ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <h2 className="items-center mt-[0.50vh]">Email</h2>
            </div>
          </div>
          <div className="transition-all duration-300">
            <div
              className={`mt-[9vh] items-center h-[10vh] w-full hover:scale-80 rounded-xl hover:bg-[#2a58ad] hover:cursor-pointer ${
                isOpen ? "grid grid-cols-2 px-[2vw] " : "flex justify-center"
              }`}
              onClick={() => {
                logout();
                router.replace("/");
              }}
            >
              {" "}
              <div className=" relative h-[3.73vh] w-[1.8vw]">
              <Image
                src="/exit.png"
                alt="Inbox"
                fill
              /></div>
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

export default NavbarBoth;
