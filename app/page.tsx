/* eslint-disable @next/next/no-img-element */
'use client'
import useMediaQuery from '@/lib/hooks/useMediaQuery'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import CloseButton from "./CloseButton";
import { toast } from "sonner";
import { CountriesDropdown } from "./CountriesDropdown";


import LandingPagePopup from './components/LandingPagePopup';
function Page() {

  const [popupOpen,setPopupOpen] = useState(false);
   const isMobile = useMediaQuery("(max-width: 767px)");

    return isMobile? landingPageMobile({ popupOpen, setPopupOpen }) : (landingPageDesktop({ popupOpen, setPopupOpen })); 
}

function landingPageMobile(props: {
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { popupOpen, setPopupOpen } = props;
  return(
<>
      <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="/img/dempaLogo.png"
            alt="Dempa Logo"
            className="drop-shadow-lg shadow-black/90 h-[45vh] w-[100vw]"
          ></img>
          <img
            src="/img/dempaLogoTxt.png"
            alt="Logo Text"
            className="h-[9vh] w-auto drop-shadow-lg shadow-black/90"
          ></img>
          <LandingPagePopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
        </div>

        <Link href={"/loginPage"}>
          <Button
            className=" bg-red-600 rounded-[5vw] text-white w-[25vw] h-[4vh] text-[5vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] active:scale-90 transition-all duration-300"
          >
            LOGIN
          </Button>
        </Link>
        <Button
          className="fixed top-5 right-5 cursor-pointer transition-all duration-500 active:scale-70 w-[25vw] h-[5vh] text-[4vw]"
          onClick={() => {
            setPopupOpen(!popupOpen);
          }}
        >
          Subscribe
        </Button>
      </div>
    </>
  );
}

function landingPageDesktop(props: {
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { popupOpen, setPopupOpen } = props;
  return(
    <>
      <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="/img/dempaLogo.png"
            alt="Dempa Logo"
            className="drop-shadow-lg shadow-black/90 h-[60vh] w-auto"
          ></img>
          <img
            src="/img/dempaLogoTxt.png"
            alt="Logo Text"
            className="h-[11.4vh] drop-shadow-lg shadow-black/90"
          ></img>

          <LandingPagePopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
        </div>

        <Link href={"/loginPage"}>
          <Button
            className="w-auto h-[4vh] bg-red-600 rounded-full text-white text-[1vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] active:scale-90 transition-all duration-300"
          >
            LOGIN
          </Button>
        </Link>
        <Button
          className="fixed top-5 right-5 cursor-pointer transition-all duration-500 active:scale-70 w-[6vw] h-[4vh] text-[1vw]"
          onClick={() => {
            setPopupOpen(!popupOpen);
          }}
        >
          Subscribe
        </Button>
        
      </div>
    </>
  );
}


export default Page
