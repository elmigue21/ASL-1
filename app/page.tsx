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
            className="drop-shadow-lg shadow-black/90 h-[60vh] w-auto xsm:h-[212px] xsm:w-[212px] sm:h-[286px] sm:w-[286px] md:h-[516px]md:w-[516px] lg:h-[704px] lg:w-[704px] xl:h-[500px] xl:w-[500px]"
          ></img>
          <img
            src="/img/dempaLogoTxt.png"
            alt="Logo Text"
            className="h-[11.4vh] drop-shadow-lg shadow-black/90 xsm:h-[76px] xsm:w-[260px] sm:h-[90px] sm:w-[320px] md:h-[100px]md:w-[516px] lg:h-[170px] lg:w-[680px] xl:h-[120px] xl:w-[500px]"
          ></img>

          {/* <div className="sm:bg-red-500 md:bg-blue-500 lg:bg-orange-600 xl:bg-amber-300">asdfasdfasdfsdaf</div> */}
          <LandingPagePopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
        </div>

        <Link href={"/loginPage"}>
          <Button className="w-[30%] h-[6vh] bg-red-600 rounded-full text-white text-[3vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] xsm:h-[25px] xsm:w-[79px] xsm:text-[15px] sm:h-[32px] sm:w-[113px] sm:text-[15px] md:h-[53px]md:w-[150px] md:text-[21px] lg:w-[205px] lg:h-[73px] lg:text-[30px] xl:h-[50px] xl:w-[180px] xl:text-[25px]">
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
