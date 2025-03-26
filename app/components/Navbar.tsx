// import { Subscript } from 'lucide-react'
'use client'
import React from 'react'
import Dropdown_Profie from './dropdown_profile'
import Link from 'next/link'
// import img from 'next/img'




const Navbar = () => {

  return (
    <div className="z-50">
      <div className="fixed left-0 top-0 h-25 w-full bg-white text-black py-4 shadow-[0px_2px_10px_-3px_#000000] z-50 flex items-center px-4">
        <div className="fixed left-0 top-0 h-25 w-40 bg-[#1e2e80] z-50 flex justify-center items-center">
          <ul>
            <img
              src="menu-burger.png"
              alt="Hamburger Menu"
              className="w-10 h-8"
            />
          </ul>
        </div>

        <div className="flex items-center gap-x-3  mx-auto fixed left-50">
          <img src="dempaLogo.png" alt="Logo" className="h-20 w-20" />
          <img src="dempaLogoTxt.png" alt="Logo Text" className="w-42 h-9" />

          <div className="justify-center fixed right-20">
            <Dropdown_Profie></Dropdown_Profie>
          </div>
        </div>
      </div>
      <div
        style={{ fontFamily: "Inter, sans-serif" }}
        className="fixed left-0 top-25 h-full w-40 bg-[#1e2e80] text-white flex flex-col py-12  z-40 text-m gap-y-12"
      >
        <Link href="/dashboardPage">
          <div className="flex flex-row justify-center gap-x-3 hover:bg-white hover:bg-opacity-30 rounded-2xl p-3">
            {" "}
            <img
              src="layout-fluid.png"
              alt="Dashboard Icon"
              className="w-8 h-8"
            />
            <h2 className="items-center mt-1">Dashboard</h2>
          </div>
        </Link>
        <div className="flex flex-row justify-center gap-x-3 ms-4 -my-3">
          {" "}
          <img
            src="chart-histogram.png"
            alt="Subscription Stats"
            className="w-8 h-8 mt-3"
          />
          <h2 className="items-center mt-1">Subscription Stats</h2>
        </div>
        <div className="flex flex-row justify-center gap-x-3">
          {" "}
          <img src="refresh.png" alt="User Update" className="w-8 h-8" />
          <h2 className="items-center mt-1">User Update</h2>
          </div>
        <div className="flex flex-row justify-center gap-x-3">
          {" "}
          <img src="user-add.png" alt="Add Account" className="w-8 h-8" />
          <h2 className="items-center mt-1">Add Account</h2>
        </div>
        <div>
          <hr className="border-t-2 border-white my-4 w-35 mx-auto opacity-50" />
        </div>
        <div className="flex flex-row justify-center gap-x-3 text-xl">
          {" "}
          <img src="circle-user.png" alt="Account" className="w-10 h-10" />
          <h2 className="items-center mt-1">Account</h2>
        </div>
        <div className="flex flex-row justify-center gap-x-3 text-xl me-5">
          {" "}
          <img src="mail-plus-circle.png" alt="Inbox" className="w-10 h-10" />
          <h2 className="items-center mt-1">Inbox</h2>
        </div>
        <div className="mt-auto flex flex-row justify-center gap-x-3 text-lg me-5 pb-16">
          {" "}
          <img src="exit.png" alt="Inbox" className="w-9 h-9" />
          <h2 className="items-center mt-1">Log Out</h2>
        </div>
      </div>
    </div>
  );
}

export default Navbar
