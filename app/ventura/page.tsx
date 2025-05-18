'use client'
import React from 'react'
import useMediaQuery from '@/lib/hooks/useMediaQuery'
function Ventura() {

      const isMobile = useMediaQuery("(max-width: 767px)");

      return isMobile? <VenturaMobile/> : <VenturaDesktop/>

  return (
    <div>Ventura</div>
  )
}


function VenturaMobile() {


  return <div className="h-[100vh] w-[100vw] bg-blue-500">Mobile Ventura</div>;
}
function VenturaDesktop() {

  return (
    <div className="h-[100vh] w-[100vw] bg-red-500">
      <h1>Desktop Ventura</h1>
    </div>
  );
}
export default Ventura