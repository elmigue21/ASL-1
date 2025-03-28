
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
function page() {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
      
      <div className="flex flex-col items-center justify-center h-full">
      
        <img  src="/img/dempaLogo.png" alt="Dempa Logo" className="drop-shadow-lg shadow-black/90 h-125"></img>
        <img src="/img/dempaLogoTxt.png" alt="Logo Text" className="h-25 drop-shadow-lg shadow-black/90"></img>
      </div>

      <Link href={"/loginPage"}><Button className="px-8 py-2 bg-red-600 rounded-full text-white text-2xl cursor-pointer hover:bg-red-700 absolute bottom-15 right-20">LOGIN</Button></Link>
    
    </div>  
  )

}
export default page
