"use client";

import { useState } from "react";

interface ChangePasswordProps {
  className?: string;
  widthPercentage?: number; 
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ className, widthPercentage = 40 }) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  // Convert widthPercentage to relative units
  const textSize = `calc(${widthPercentage}vw * 0.05)`; 
  const paddingSize = `calc(${widthPercentage}vw * 0.02)`; 
  const heightSize = `calc(${widthPercentage}vw * 0.15)`; 

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Change Password Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: `${widthPercentage}vw`,
            height: heightSize,
            fontSize: textSize,
          }}
          className="bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 cursor-pointer"
        >
          Change Password
        </button>
      )}

      {/* Password Change Form */}
      {showForm && (
        <div style={{ width: `${widthPercentage}vw`, padding: paddingSize }} className="space-y-[2vh]">
          <input
            type="password"
            placeholder="Current Password"
            style={{ fontSize: textSize, padding: paddingSize }}
            className="w-full border border-gray-300 rounded-[1vw] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="New Password"
            style={{ fontSize: textSize, padding: paddingSize }}
            className="w-full border border-gray-300 rounded-[1vw] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            style={{ fontSize: textSize, padding: paddingSize }}
            className="w-full border border-gray-300 rounded-[1vw] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowForm(false)}
            style={{
              width: "100%",
              height: heightSize,
              fontSize: textSize,
            }}
            className="bg-green-500 text-white rounded-[1vw] transition hover:bg-green-600 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
