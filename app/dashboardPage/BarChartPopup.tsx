import React from 'react'
import { CountryBarChart } from '../components/CountryBarChart'
import { usePopupContext } from '../context/PopupContext';
const BarChartPopup = () => {
    const {isOpen} = usePopupContext();
    console.log('mounted')
  return (
    <>

        <div className={`w-full h-full flex items-center justify-center z-50 fixed ${isOpen ? '' : 'hidden'}`}>
          <CountryBarChart />
        </div>

    </>
  );
}

export default BarChartPopup