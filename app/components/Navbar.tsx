// import { Subscript } from 'lucide-react'
'use client'
import React from 'react'
import Dropdown_Profie from './dropdown_profile'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setOpenState } from '@/store/slices/emailWindowSlice'





const Navbar = () => {
  const dispatch = useDispatch();
  const openClicked = () => {
    dispatch(setOpenState(true));
  };
  return (
    <div className="z-50">
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="fixed left-0 top-0 h-[11vh] w-full bg-white text-black shadow-[0px_2px_10px_-3px_#000000] z-50 flex items-center px-4">
        <div className="fixed left-0 top-0 h-[11vh] w-[8.35vw] bg-[#1e2e80] z-50 flex justify-center items-center">
=======
=======
>>>>>>> b39cb58eb801c187a46235366604c56e5104695a
      <div className="fixed left-0 top-0 h-[11vh] w-full bg-white text-black shadow-[0px_2px_10px_-3px_#000000] z-50 flex items-center px-4 overflow-hidden">
        <div className="absolute left-0 top-0 h-[11vh] w-[8.35vw] bg-[#1e2e80] z-50 flex justify-center items-center">
>>>>>>> b39cb58eb801c187a46235366604c56e5104695a
          <ul>
            <img
              src="menu-burger.png"
              alt="Hamburger Menu"
              className="w-[2vw] h-[1.7vw]"
            />
          </ul>
        </div>

        <div className="flex items-center gap-x-[0.4vw]  mx-auto absolute left-[10.44vw]">
          <img src="dempaLogo.png" alt="Logo" className="h-[8.9vh] w-[4.2vw]" />
          <img
            src="dempaLogoTxt.png"
            alt="Logo Text"
            className="w-[8.2vw] h-[4.5vh]"
          />
          <div className="justify-center absolute left-[78vw]">
            <Dropdown_Profie></Dropdown_Profie>
          </div>
        </div>
      </div>
      <div
        style={{ fontFamily: "Inter, sans-serif" }}
<<<<<<< HEAD
<<<<<<< HEAD
        className="fixed left-0 h-full w-[8.35vw] bg-[#1e2e80] text-white flex flex-col py-[5vh]  z-40 text-[0.87vw] gap-y-[5.65vh] font-bold pt-[15vh]"
=======
        className="fixed left-0 top-[11vh] h-full w-[8.35vw] bg-[#1e2e80] text-white flex flex-col py-[5vh]  z-40 text-[0.87vw] gap-y-[5.65vh] font-bold"
>>>>>>> b39cb58eb801c187a46235366604c56e5104695a
=======
        className="fixed left-0 top-[11vh] h-full w-[8.35vw] bg-[#1e2e80] text-white flex flex-col py-[5vh]  z-40 text-[0.87vw] gap-y-[5.65vh] font-bold"
>>>>>>> b39cb58eb801c187a46235366604c56e5104695a
      >
        <Link href="/dashboardPage">
          <div className="flex flex-row justify-center gap-x-[0.5vw]">
            {" "}
            <img
              src="layout-fluid.png"
              alt="Dashboard Icon"
              className="w-[1.69vw] h-[3.73vh]"
            />
            <h2 className="items-center mt-[0.50vh]">Dashboard</h2>
          </div>
        </Link>
        <Link href="/tablesPage">
          <div className="flex flex-row justify-center gap-x-[0.5vw] ms-[0.50vw] -my-[0.5vh]">
            {" "}
            <img
              src="chart-histogram.png"
              alt="Subscription Stats"
              className="w-[1.69vw] h-[3.73vh] mt-[1.3vh]"
            />
            <h2 className="items-center mt-[0.50vh]">Subscription Stats</h2>
          </div>
        </Link>
        <Link href="/backupPage">
          {" "}
          <div className="flex flex-row justify-center gap-x-[0.5vw]">
            {" "}
            <img
              src="refresh.png"
              alt="User Update"
              className="w-[1.69vw] h-[3.60vh]"
            />
            <h2 className="items-center mt-[0.50vh]">Backups</h2>
          </div>
        </Link>

        <Link href="/addAccPage">
          <div className="flex flex-row justify-center gap-x-[0.5vw]">
            {" "}
            <img
              src="user-add.png"
              alt="Add Account"
              className="w-[1.69vw] h-[3.73vh]"
            />
            <h2 className="items-center mt-[0.50vh]">Add Account</h2>
          </div>{" "}
        </Link>
        <div>
          <hr className="border-t-[0.3vh] border-white my-[1.50vh] w-[6.8vw] mx-auto opacity-50" />
        </div>
        <div className="flex flex-row justify-center gap-x-[0.6vw] text-[1.09vw]">
          {" "}
          <img
            src="circle-user.png"
            alt="Account"
            className="w-[2.08vw] h-[2vw]"
          />
          <h2 className="items-center mt-[0.50vh]">Account</h2>
        </div>
        <div
          className="flex flex-row justify-center gap-x-[0.6vw] text-[1.09vw] me-[0.50vw] cursor-pointer"
          onClick={() => {
            openClicked();
          }}
        >
          {" "}
          <img
            src="mail-plus-circle.png"
            alt="Inbox"
            className="w-[2.08vw] h-[2.1vw]"
          />
          <h2 className="items-center mt-[0.5vh]">Email</h2>
        </div>
        <Link href={"/"}>
          <div className="mt-[9vh] flex flex-row justify-center gap-x-[0.6vw] text-[1.09vw]">
            {" "}
            <img src="exit.png" alt="Inbox" className="w-[2vw] h-[2vw]" />
            <h2 className="items-center mt-1">Log Out</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar
