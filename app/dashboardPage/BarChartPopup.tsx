import React from 'react'
import { CountryBarChart } from '../components/CountryBarChart'
import { usePopupContext } from '../context/PopupContext';
const BarChartPopup = () => {
    const {isOpen} = usePopupContext();
  return (
    <>
      {isOpen && (
        <div className="w-full h-full flex items-center justify-center z-50 fixed">
          <CountryBarChart />
        </div>
      )}
    </>
  );
}

export default BarChartPopup