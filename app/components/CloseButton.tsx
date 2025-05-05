import React from 'react';

interface ButtonProps {
  onClick?: () => void; // Type for the onClick function
  className?: string; // Optional className for additional styling
}

const CloseButton: React.FC<ButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-0 right-0 flex items-center justify-center m-[2vh] p-0 w-fit h-fit group cursor-pointer w-fit h-fit ${className}`}
    >
        <img src="rectangle-xmark.png" alt="Close" className="size-[2vw] block group-hover:hidden"/>
        <img src="rectangle-xmark-red.png" alt="Close (hover)" className="size-[2vw] hidden group-hover:block"/>
      
    </button>
  );
};

export default CloseButton;