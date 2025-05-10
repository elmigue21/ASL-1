import React from 'react';

interface StepperProps {
  list: string[];
}

const StepperList: React.FC<StepperProps> = ({ list }) => {
  return (
    <div className="flex flex-col">
      {list.map((item, index) => (
        <div key={index} className="flex relative items-start py-[0.8vh]">
          <div className="flex items-start gap-x-[1vw] w-full">
            {/* Dot */}
            <div
              className={`w-[1.5vh] h-[1.5vh] rounded-full mt-[0.75vh] ${
                index === 0 ? 'bg-black' : 'bg-gray-300'
              }`}
            />
            {/* List Item */}
            <span
              className={`text-[2vh] whitespace-normal text-wrap break-all max-w-1/2 ${
                index === 0 ? 'text-black font-semibold' : 'text-gray-400'
              }`}
            >
              {item}
            </span>
            {/* Badge */}
            {index === 0 && (
              <span className="absolute right-[1vw] text-[1.5vh] text-black border border-black rounded-full px-[1vw] py-[0.5vh]">
                Current
              </span>
            )}
          </div>
          
          {/* Line */}
          {index < list.length - 1 && (
            <div className="absolute h-full w-[0.15vw] bg-gray-300 mt-[0.75vh] ml-[0.25vw] z-[-1]" />
          )}
          
          
          
        </div>
      ))}
    </div>
  );
};

export default StepperList;
