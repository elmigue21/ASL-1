import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen flex-col gap-10">
        <h1 className="text-4xl font-bold text-red-500">You are not authorized to access that page.</h1>
        <Link href="/dashboardPage">
        <Button className="bg-white text-black border border-black shadow-lg hover:scale-110 active:scale-90 transition-all duration-300 hover:bg-slate-200 hover:cursor-pointer">Go back</Button>
        </Link>
    </div>
  );
}

export default UnauthorizedPage