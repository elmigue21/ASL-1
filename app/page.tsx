/* eslint-disable @next/next/no-img-element */

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
function page() {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
      
      <div className="flex flex-col items-center justify-center h-full">
        <img  src="/img/dempaLogo.png" alt="Dempa Logo" className="drop-shadow-lg shadow-black/90 h-[30vh] md:h-[40vh] lg:h-[516px] md:w-[516px]"></img>
        <img src="/img/dempaLogoTxt.png" alt="Logo Text" className="h-[8vh] drop-shadow-lg shadow-black/90 md:h-[10vh] lg:h-[184px] md:w-[516px]"></img>
        {/*<div className="sm:bg-red-500 md:bg-amber-300 pangalan:bg-slate-500">asdfasdfasdfsdaf</div>*/}
      </div>

      <Link href={"/loginPage"}><Button className="w-[30%] h-[6vh] bg-red-600 rounded-full text-white text-[3vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw] md:h-[53px] md:w-[150px] md:text-[21px] ">LOGIN</Button></Link>
    </div>  
  )

}
export default page
