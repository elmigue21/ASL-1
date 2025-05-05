import React, { useState } from 'react';

interface DropdownButtonProps {
  className?: string;
  dropdownClassName?: string,
  children: React.ReactNode; // Custom dropdown content
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  className = '',
  dropdownClassName = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center cursor-pointer"
      >
        
        <img
          src={isOpen ? "caret-up-24px.png": "caret-down-24px.png"}
          alt="arrow"
          className="w-4 h-4 transition-transform duration-200"
        />
      </button>

      {isOpen && (
        <div className={`bg-white border rounded shadow-lg z-10 ${dropdownClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
