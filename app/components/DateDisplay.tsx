"use client"
import { useState, useEffect } from "react";
type DateDisplayProps = {
  className?: string;
};

const DateDisplay: React.FC<DateDisplayProps> = ({ className }) => {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setDate(now.toLocaleDateString("en-US", options));
    };

    updateDate(); // Set initially
    const interval = setInterval(updateDate, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
      <div>
        <h2 className={`text-[1vw] font-bold text-black ${className ?? ""}`}>{date}</h2>
      </div>
  );
};

export default DateDisplay;
