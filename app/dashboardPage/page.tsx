"use client";
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { DonutChart } from "../components/DonutChart";
import { SubsAreaChart } from "../components/SubsAreaChart";
// import Navbar from "../components/Navbar";
import DateDisplay from "../components/DateDisplay";
import { useState, useEffect } from "react";
import { CountryBarChart } from "../components/CountryBarChart";

// import { supabase } from "../../lib/supabase";
// import BarChartPopup from "./BarChartPopup";
// import { ConfirmDialog } from "../components/ConfirmDialog";
import { PopupProvider } from "../context/PopupContext";

import { NewSubDateRangeProvider } from "../context/NewSubDateRangeContext"; // Adjust the path if needed
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import useMediaQuery from '@/lib/hooks/useMediaQuery'
interface CountryDataProps{
  country: string;
  count: number;
}

const Dashboard = () => {
  const [countryCount, setCountryCount] = useState(0);
  const [totalSub, setTotalSub] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [inactiveSub, setInactiveSub] = useState(0);
  const [countryData, setCountryData] = useState<CountryDataProps[]>([]);
const fetchCountryCount = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/countrycount`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // send cookies automatically
    }
  );

  let data = await response.json();

  data = data
    .map((item: CountryDataProps) => ({
      ...item,
      country: item.country?.trim() ? item.country.trim() : "N/A",
    }))
    .sort(
      (
        a: { country: string; count: number },
        b: { country: string; count: number }
      ) => b.count - a.count
    );

  setCountryData(data);
  setCountryCount(data.length);
  // console.log("Countries:", data);
};


  // useEffect(()=>{
  //   fetchCountryCount();
  // },[])
  const fetchTotalSubs = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/subCount`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    setTotalSub(data);
  };

  const fetchInactiveSubs = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/inactiveCount`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    setInactiveSub(data);
    // console.log("inactive:", data);
  };

  const fetchActiveSubs = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/activeCount`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    setActiveSub(data.count);
    // console.log("active",data)
  };

  useEffect(() => {
    fetchCountryCount();
    fetchActiveSubs();
    fetchInactiveSubs();
    fetchTotalSubs();
  }, []);

const [isOpen, setIsOpen] = useState(false);

const expandClicked = ()=>{
  setIsOpen(!isOpen);
  console.log('clicked')
}
      const isMobile = useMediaQuery("(max-width: 767px)");
      return isMobile? DashboardMobile({ totalSub, activeSub, inactiveSub, countryCount, countryData, expandClicked, isOpen})
        : (
      DashboardDesktop({ totalSub, activeSub, inactiveSub, countryCount, countryData, expandClicked, isOpen})
);

};

function DashboardMobile(props: {
  totalSub: number;
  activeSub: number;
  inactiveSub: number;
  countryCount: number; 
  countryData: CountryDataProps[];
  expandClicked: () => void;
  isOpen: boolean;
}) {
  const { totalSub, activeSub, inactiveSub, countryCount, countryData, expandClicked, isOpen } = props;
  return(
    <> 
      <PopupProvider>
        {/* <Navbar /> */}

        <div className="z-45 absolute top-[10vh] left-[2.5vw] w-[95vw] h-[60vh]">
          <div
            className=""
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            <div className="text-[#1A2B88] font-semibold text-[5vw] mb-[1.5vh]">Dashboard</div>
            <div className="flex justify-evenly gap-[1vh] h-[19vh] w-[]">
              <Card className="flex-1 p-[0.70vw] gap-[4vh] rounded-[1vh]">
                <div className="flex text-[3vw] justify-center pt-[1.5vh] align-middle">
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw] text-[]">
                    Total Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Active Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Inactive Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw] mt-[1vh]">
                    Countries
                  </CardHeader>
                </div>
                <div className="flex text-[7vw] text-center font-bold text-blue-900 -mt-[1.8vh] height[1vh]">
                  <>
                    {totalSub !==null ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1"
                        key={`total-${totalSub}`}
                      >
                        <CardContent>{totalSub}</CardContent>
                      </motion.div>
                    ) : (
                      <Loader className="flex-1" />
                    )}
        {activeSub ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.1,
                      }}
                      key={`active-${activeSub}`}
                      className="flex-1"
                    >
                      <CardContent>{activeSub}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}
{inactiveSub !==null ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      className="flex-1"
                      key={`inactive-${inactiveSub}`}
                    >
                      <CardContent>{inactiveSub}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}

                   {countryCount !==null?( <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                      className="flex-1"
                      key={`countryCount-${countryCount}`}
                    >
                      <CardContent>{countryCount}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}
                  </>
                  {/* )} */}
                </div>
                <div className="-my-[3vh]">
                  <DateDisplay className="text-[3vw] ml-[3vw] mt-[1.5vw]"  />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex justify-evenly h-[95vh] w-[95vw] flex-col overflow-x-hidden overflow-y-hidden mt-[-8vh]">
            <div className="w-[95vw] h-[30vh]">
              <CountryBarChart
                countryData={countryData.slice(0, 5)}
                expandClickedAction={() => expandClicked()}
                // titleClassName="text-[5vw]"
                // descriptionClassName="text-[4vw]"
                // expandIconClassName="w-[4vw] h-[4vw]"
                // labelClassName="text-[3vw]"
                // chartContainerClassName="text-[4vw] font-medium"
                // cardContentClassName="h-[24vh]"
              />
              {/* <DonutChart chartData={countryData} chartHeightVH={30} innerRadiusVW={20} cardHeightVH={50} tspanFontSizeVH={2.5} cardHeaderFontSizeVH={2} cardPaddingVW={2}/> */}
            </div>
            <NewSubDateRangeProvider>
              <div className="w-[95vw] h-auto">
                <SubsAreaChart 
                titleClassName="text-[4.7vw]"
                cardContentClassName="h-[25vh] w-[113vw] ml-[-10vw]"
                xAxisClassName="text-[3.5vw]"
                yAxisClassName="text-[4vw]"
                scbButton="w-[25vw] text-[3.7vw]"
                scbPopover="w-[25vw]"
                scbCommandItem="text-[4vw]"
                chartMargin={{ left: 12, right: 35, bottom: 55}}
                
                
                />
              </div>
            </NewSubDateRangeProvider>
          </div>
        </div>

        {/* <div className="fixed z-50 w-full h-full flex items-center justify-center bottom-20"> */}
        {/* <BarChartPopup /> */}
        <div
          className={`z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[95vw] ${
            isOpen ? "block" : "hidden"
          }`}
          style={{ top: "calc(50% - 60px)" }}
        >
          <CountryBarChart
            countryData={countryData}
            expandClickedAction={() => expandClicked()}
            // titleClassName="text-[5vw]"
            // descriptionClassName="text-[4vw]"
            // expandIconClassName="w-[4vw] h-[4vw]"
            // labelClassName="text-[3vw]"
            // chartContainerClassName="text-[4vw] font-medium"
          />
        </div>
        {/* </div> */}
      </PopupProvider>
    </>
  )
}

function DashboardDesktop(props: {
  totalSub: number;
  activeSub: number;
  inactiveSub: number;
  countryCount: number; 
  countryData: CountryDataProps[];
  expandClicked: () => void;
  isOpen: boolean;
}){
const { totalSub, activeSub, inactiveSub, countryCount, countryData, expandClicked, isOpen} = props;
  return(
<> 
      <PopupProvider>
        {/* <Navbar /> */}

        <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh]">
          <div
            className="m-[5vh]"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            <div className="flex justify-evenly gap-[1vh] h-[19vh]">
              <Card className="flex-1 p-[0.70vw] gap-[4vh] rounded-[1vh]">
                <div className="flex text-[1vw] justify-center">
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Total Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Active Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Inactive Subscribers
                  </CardHeader>
                  <CardHeader className="flex-1 text-center font-bold gap-[0.5vw] px-[0vw]">
                    Countries
                  </CardHeader>
                </div>
                <div className="flex text-[2vw] text-center font-bold text-blue-900 -mt-[1.8vh] height[1vh]">
                  <>
                    {totalSub !==null ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1"
                        key={`total-${totalSub}`}
                      >
                        <CardContent>{totalSub}</CardContent>
                      </motion.div>
                    ) : (
                      <Loader className="flex-1" />
                    )}
        {activeSub ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.1,
                      }}
                      key={`active-${activeSub}`}
                      className="flex-1"
                    >
                      <CardContent>{activeSub}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}
{inactiveSub !==null ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      className="flex-1"
                      key={`inactive-${inactiveSub}`}
                    >
                      <CardContent>{inactiveSub}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}

                   {countryCount !==null?( <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                      className="flex-1"
                      key={`countryCount-${countryCount}`}
                    >
                      <CardContent>{countryCount}</CardContent>
                    </motion.div>): (<Loader className="flex-1 animate-spin" />)}
                  </>
                  {/* )} */}
                </div>
                <div className="-my-[3vh]">
                  <DateDisplay className="text-[1vw]" />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex justify-evenly h-[40vh] max-h[40vh]">
            <div className="w-[50vw]">
              <CountryBarChart
                countryData={countryData.slice(0, 5)}
                expandClickedAction={() => expandClicked()}
              />
              {/* <DonutChart chartData={countryData} chartHeightVH={30} innerRadiusVW={20} cardHeightVH={50} tspanFontSizeVH={2.5} cardHeaderFontSizeVH={2} cardPaddingVW={2}/> */}
            </div>
            <NewSubDateRangeProvider>
              <div className="w-full">
                <SubsAreaChart />
              </div>
            </NewSubDateRangeProvider>
          </div>
        </div>

        {/* <div className="fixed z-50 w-full h-full flex items-center justify-center bottom-20"> */}
        {/* <BarChartPopup /> */}
        <div
          className={`z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 ${
            isOpen ? "block" : "hidden"
          }`}
          style={{ top: "calc(50% - 60px)" }}
        >
          <CountryBarChart
            countryData={countryData}
            expandClickedAction={() => expandClicked()}
          />
        </div>
        {/* </div> */}
      </PopupProvider>
    </>

  );
}

export default Dashboard;
