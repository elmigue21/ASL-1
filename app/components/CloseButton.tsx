import React from 'react';
import Image from 'next/image'

interface ButtonProps {
  onClick?: () => void; // Type for the onClick function
  className?: string; // Optional className for additional styling
}

const CloseButton: React.FC<ButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-0 right-0 flex items-center justify-center m-[2vh] p-0 w-fit h-fit group cursor-pointer ${className}`}
    >
        <Image src="rectangle-xmark.png" alt="Close" className="size-[2vw] block group-hover:hidden" width={30} height={30}/>
        <Image src="rectangle-xmark-red.png" alt="Close (hover)" className="size-[2vw] hidden group-hover:block" width={30} height={30}/>
      
    </button>
  );
};

export default CloseButton;