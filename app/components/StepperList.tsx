import React from 'react';

interface EmailTimelineProps {
  emails: string[];
}

const StepperList: React.FC<EmailTimelineProps> = ({ emails }) => {
  return (
    <div className="flex flex-col space-y-4">
      {emails.map((email, index) => (
        <div key={index} className="flex items-center space-x-2">
          {/* Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              index === 0 ? 'bg-black' : 'bg-gray-300'
            }`}
          />
          {/* Line */}
          {index < emails.length - 1 && (
            <div className="absolute h-6 w-px bg-gray-300 ml-[5px] mt-2" />
          )}
          {/* Email */}
          <span
            className={`text-sm ${
              index === 0 ? 'text-black font-semibold' : 'text-gray-400'
            }`}
          >
            {email}
          </span>
          {/* Badge */}
          {index === 0 && (
            <span className="ml-auto text-xs text-gray-500 border border-gray-300 rounded-full px-2 py-0.5">
              Current
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepperList;
