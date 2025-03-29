
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
function page() {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
      
      <div className="flex flex-col items-center justify-center h-full">
        <img  src="/img/dempaLogo.png" alt="Dempa Logo" className="drop-shadow-lg shadow-black/90 h-[60vh]"></img>
        <img src="/img/dempaLogoTxt.png" alt="Logo Text" className="h-[11.4vh] drop-shadow-lg shadow-black/90"></img>
      </div>

      <Link href={"/loginPage"}><Button className="w-[7vw] h-[4vh] max-h-[4vh] max-w-[7vw] bg-red-600 rounded-full text-white text-[1.24vw] cursor-pointer hover:bg-red-700 absolute bottom-[6.5vh] right-[4.2vw]">LOGIN</Button></Link>
    </div>  
  )

}
export default page
