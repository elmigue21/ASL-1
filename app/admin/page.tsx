import React from 'react'
import Link from "next/link";
import Image from "next/image";

const AdminPage = () => {
  return (
    <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[88vh] px-[3vw] py-[2vh] overflow-hidden">
        <div className="font-bold text-[#1E2E80] text-[1.60vw]">
            Admin Settings
        </div>
        <div className='flex flex-row mt-[8vh] gap-x-[5vw] justify-center'>
            <Link
            href="/admin/register"
            className="hover:scale-80 rounded-xl hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center border-black border-8 h-[20vh] w-[30vw] text-[#1E2E80] text-[1.60vw] font-semibold">
                  <div className=" relative h-[9vh] w-[4.3vw]">
                      <Image src="/admin-register.png" alt="Register Employee" fill />
                    </div>
                  <p className='mt-[2.5vh] ml-[2vw]'>Register Employee</p>
              </div>
            </Link>
            <Link 
            href="/admin/employee"
            className="hover:scale-80 rounded-xl hover:shadow-xl  transition-all duration-300">
              <div className="flex items-center justify-center border-black border-8 h-[20vh] w-[30vw] text-[#1E2E80] text-[1.60vw] font-semibold">
                  <div className=" relative h-[9vh] w-[4.3vw]">
                      <Image src="/admin-manage.png" alt="ManageEmployee" fill />
                    </div>
                  <p className='ml-[2vw]'>Manage Employee</p>
              </div>
            </Link>
        </div>
    </div>
);
}

export default AdminPage