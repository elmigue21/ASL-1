import React from 'react'
import CloseButton from './CloseButton'
import DropdownButton from './DropdownButton'

const ViewSubscriber = () => {
  return (
    
    <div className='fixed z-100 w-[100vw] h-[100vh] bg-slate-800/20 flex justify-center items-center'>
        <div className="relative w-auto h-[77vh] rounded-[0.60vw] shadow-xl shadow-black/20 bg-white">
        <CloseButton/>
            <div className='px-[2.5vw] py-[2vh]'>
                <div className="text-[#2F80ED] text-[2vw]">Subscriber Information</div>
                <div className="flex flex-row gap-x-[10vw] my-[1vh]">
                    <div className="flex-col">
                        <div className="text-[0.85vw]">First Name <span className="text-red-600">*</span></div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Subscriber First Name</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Last Name</div>
                        
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Subscriber Surname</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Phone Number</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>+63 1234 567 8910</p>
                        </div>
                    </div>
                    {/* <div className="flex-col">
                        <div className="text-white">.</div>
                        <div className="border border-solid border-black h-auto w-auto text-center px-[0.3vw] rounded-[1vw]">+ Add Phone No.</div>
                    </div> */}
                </div>
                <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

                <div className="flex flex-row gap-x-[10vw]">
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Email</div>
                        <div className="w-[18vw] gap-x-[1vw] pt-[0.5vh] flex items-center"> 
                            <p className='text-[1.2vw]  font-medium'>subscriber@email.com</p>
                            <div>
                                <DropdownButton dropdownClassName='absolute right-[1vw] min-w-auto px-[1vw] py-[1vh] max-w-[14vw] m-[1vh] max-h-[20vh] overflow-y-auto'>
                                    <ul className="text-[1vw]">
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                        <li className="whitespace-normal"> subEmail@email.com</li>
                                    </ul>
                                </DropdownButton>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Facebook URL</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>facebook.com/subscriber</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">LinkedIn URL</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>linkedin.com/subscriber</p>
                        </div>
                    </div>
                </div>
                <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

                <div className="text-[#2F80ED] text-[1vw]">Address</div>
                <div className="flex flex-row gap-x-[10vw]">
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Country</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Country of Residence</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">City</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>City Address</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Region</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Region/State</p>
                        </div>
                    </div>
                </div>
                <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>

                <div className="text-[#2F80ED] text-[1vw] flex flex-row gap-x-[35vw]">
                    <div>Occupation</div>
                    <div>Industry</div> 
                </div>
                
                <div className="flex flex-row gap-x-[10vw]">
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Role</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Subscriber Role</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Field</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Subscriber Field of Work</p>
                        </div>
                    </div>
                </div>
                <div><hr className="border-t-[0.3vh] border-black my-[1.50vh] w-[70vw] mx-auto opacity-20" /></div>
                <div className="text-[#2F80ED] text-[1vw]">Company</div>
                <div className="flex flex-row gap-x-[10vw]">
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Company Name</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Company Name</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">Website</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Company Website</p>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-[0.85vw]">LinkedIn URL</div>
                        <div className="text-[1.2vw] w-[18vw] pt-[0.5vh] font-medium"> 
                            <p>Company LinkedkIn</p>
                        </div>
                    </div>
                    
                </div>
                <div className="bg-[#3AC31833] text-[1.2vw] h-[5vh] w-[7vw] rounded-[1.5vw] flex justify-center items-center absolute right-0 bottom-0 m-[2vh] cursor-pointer hover:bg-emerald-300">Edit</div>
            </div>
            

            
        </div>
    </div>
    
    
  )
}

export default ViewSubscriber