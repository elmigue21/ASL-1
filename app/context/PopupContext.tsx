import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context state
interface PopupContextType {
  isOpen: boolean;
  togglePopup: () => void; // Function to toggle the popup state
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Define the provider component
export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Define state for controlling popup visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Function to toggle the popup state
  const togglePopup = () => setIsOpen((prevState) => !prevState);

  // Provide context value to the children components
  return (
    <PopupContext.Provider value={{ isOpen, togglePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

// Custom hook to use the PopupContext in components
export const usePopupContext = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopupContext must be used within a PopupProvider");
  }
  return context;
};
