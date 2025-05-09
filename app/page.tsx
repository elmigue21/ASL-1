/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LandingPagePopup from './components/LandingPagePopup';
function page() {

  const [popupOpen,setPopupOpen] = React.useState(false);

  return (
    <>
      <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="/img/dempaLogo.png"
            alt="Dempa Logo"
            className="drop-shadow-lg shadow-black/90 h-[60vh]"
          ></img>
          <img
            src="/img/dempaLogoTxt.png"
            alt="Logo Text"
            className="h-[11.4vh] drop-shadow-lg shadow-black/90"
          ></img>

          {/* <div className="sm:bg-red-500 md:bg-blue-500 pangalan:bg-slate-500">asdfasdfasdfsdaf</div> */}
          <LandingPagePopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
        </div>

        <Link href={"/loginPage"}>
          <Button className="w-[30%] h-[6vh] bg-red-600 rounded-full text-white text-[3vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] md:h-[53px] md:w-[150px] md:text-[21px] ">
            LOGIN
          </Button>
        </Link>
        <Button className="fixed top-5 right-5 cursor-pointer" onClick={()=>{setPopupOpen(!popupOpen)}}>Subscribe</Button>
      </div>
      {/* <div className="h-screen">
        <div>
          <Label htmlFor="asd">qweqwe</Label>
          <Input id="asd"/>
        </div>
      </div> */}
      {/* <LandingPagePopup/> */}
    </>
  );

}
export default page
