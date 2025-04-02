import React from 'react'
import Navbar from "../components/Navbar";
import { Card} from "@/components/ui/card";

function page() {
  return (
    <>
    <Navbar/>
    <div className="z-45 fixed top-25 left-40 w-[calc(100%-160px)] h-[calc(100%-101px)] content-center">
        <div className="place-self-center">
        <div style={{ fontFamily: "Inter, sans-serif" }} className="items-center mt-2 relative w-8/9">
            <h1 className="text-[6vh] font-medium text-blue-900 relative left-[2vw]">ACCOUNT SETTINGS</h1>
        </div>
        <Card className="w-[75vw] h-[70vh] shadow-[0_50px_50px_20px_rgba(0,0,0,0.05)]">

        </Card>
        </div>
    </div>
    </>
  )
}

export default page