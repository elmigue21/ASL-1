import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the possible values for dateRange
export type NewSubDateRange = "7d" | "1m" | "6m" | "1y";

// Define context shape
interface NewSubDateRangeContextType {
  dateRange: NewSubDateRange;
  setDateRange: (range: NewSubDateRange) => void;
}

// Create context
export const NewSubDateRangeContext = createContext<
  NewSubDateRangeContextType | undefined
>(undefined);

// Provider component
export const NewSubDateRangeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [dateRange, setDateRange] = useState<NewSubDateRange>("7d");

  return (
    <NewSubDateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </NewSubDateRangeContext.Provider>
  );
};

// Custom hook to use the context
export const useNewSubDateRange = () => {
  const context = useContext(NewSubDateRangeContext);
  if (!context) {
    throw new Error(
      "useNewSubDateRange must be used within a NewSubDateRangeProvider"
    );
  }
  return context;
};
