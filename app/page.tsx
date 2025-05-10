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
            //className="drop-shadow-lg shadow-black/90 h-[60vh] w-auto xsm:h-[37.32vh] xsm:w-[66.25vw] sm:h-[30.89vh] sm:w-[67.29vw] md:h-[50.47vh] md:w-[67.19vw] lg:h-[51.47vh] lg:w-[68.75vw] xl:h-[60vh] xl:w-auto"
            className="drop-shadow-lg shadow-black/90 h-[60vh] w-auto xsm:h-[37.32vh] sm:h-[30.89vh] md:h-[50.47vh] lg:h-[51.47vh] xl:h-[60vh]"
          ></img>
          <img
            src="/img/dempaLogoTxt.png"
            alt="Logo Text"
            //className="h-[11.4vh] drop-shadow-lg shadow-black/90 xsm:h-[13.38vh] xsm:w-[66.25vw] sm:h-[9.72vh] sm:w-[75.29vw] md:h-[17.97vh] md:w-[67.19vw] lg:h-[18.36vh] lg:w-[68.56vw] xl:h-[11.4vh] xl:w-auto"
            className="h-[11.4vh] drop-shadow-lg shadow-black/90 xsm:h-[13.38vh] sm:h-[9.72vh] md:h-[17.97vh] lg:h-[18.36vh] xl:h-[11.4vh]"
          ></img>

          <div className="sm:bg-red-500 md:bg-blue-500 lg:bg-orange-600 xl:bg-black">asdfasdfasdfsdaf</div>
          <LandingPagePopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
        </div>

        <Link href={"/loginPage"}>
          <Button 
          //className="w-auto h-auto bg-red-600 rounded-full text-white text-[3vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] xsm:h-[4.40vh] xsm:w-[24.69vw] xsm:text-[4.69vw] sm:h-[3.46vh] sm:w-[26.59vw] sm:text-[3.53vw] md:h-[5.18vh] md:w-[19.53vw] md:text-[2.73vw] lg:w-[20.05vw] lg:h-[5.34vh] lg:text-[2.64vw] xl:h-[6vh] xl:w-[10vw]  xl:text-[1.50vw]"
          className="w-auto bg-red-600 rounded-full text-white text-[3vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] xsm:text-[4.69vw] sm:text-[3.53vw] md:text-[2.73vw] lg:text-[2vw] xl:text-[1.50vw]"
          >
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
