'use client'
import React from 'react'
import { motion } from "framer-motion";
import {useState} from 'react';
import Link from 'next/link'
import Image from 'next/image';
// import { X } from 'lucide-react';
import {logout} from '@/utils/auth';
import {useRouter} from 'next/navigation';
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
            label:"Dashboard",
            icon:"layout-fluid",
            link:"/dashboardPage"
        },
        {
            label:"Subscriptions",
            icon:"table-layout",
            link:"/tablesPage"

        },
        {
            label:"Backups/Reports",
            icon:"refresh",
            link:"/uploadPage"

        },
        {
            label:"Create Subs",
            icon:"user-add",
            link:"/addAccPage"

        },

    ]

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
          <div className="flex flex-col items-center justify-center h-16 bg-blue-500 text-white flex-1" onClick={()=>{logout(); router.replace("/loginPage")}}>
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
            handleClick()
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
}

export default NavbarMobile