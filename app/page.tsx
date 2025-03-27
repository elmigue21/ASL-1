
import React from 'react'

function page() {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url(/img/whiteAbstractBg.jpg)] filter brightness-108">
      
      <div className=" flex-col items-center justify-items-center">
      
        <img  src="/img/dempaLogo.png" alt="Dempa Logo" className="drop-shadow-lg shadow-black/90 h-125"></img>
        <img src="/img/dempaLogoTxt.png" alt="Logo Text" className="h-25 drop-shadow-lg shadow-black/90"></img>
      </div>

      <button className="px-8 py-2 bg-red-600 rounded-full text-white text-2xl cursor-pointer hover:bg-red-700 absolute bottom-15 right-20">LOGIN</button>
    
    
  )
}
