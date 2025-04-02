"use client";
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DonutChart } from "../components/DonutChart";
import { SubsAreaChart } from "../components/SubsAreaChart";
import Navbar from "../components/Navbar";
import DateDisplay from "../components/DateDisplay";
import { useState, useEffect } from "react";

import { supabase } from "../../lib/supabase";

const Dashboard = () => {
  const [countryCount, setCountryCount] = useState(0);
  const [totalSub, setTotalSub] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [inactiveSub, setInactiveSub] = useState(0);
  const [countryData, setCountryData] = useState([]);
  const [newSubs, setNewSubs] = useState<{ day: Date; count: number }[]>([]);

  const fetchCountryCount = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/countrycount`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setCountryCount(data.length);
    setCountryData(data);
    // console.log("Countries:", data);
  };

  const fetchTotalSubs = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/subCount`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setTotalSub(data);
  };

  const fetchInactiveSubs = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/inactiveCount`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setInactiveSub(data);
    // console.log("inactive:", data);
  };

  const fetchActiveSubs = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/activeCount`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setActiveSub(data.count);
    // console.log("active:", data);
  };

  const fetchNewSubs = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/newSubs`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    // console.log("NEW SUBS:", data);
    setNewSubs(data);
  };

  useEffect(() => {
    fetchCountryCount();
    fetchActiveSubs();
    fetchInactiveSubs();
    fetchTotalSubs();
    fetchNewSubs();
  }, []);

  return (
    <>
      <Navbar />

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
                <CardContent className="flex-1">{totalSub}</CardContent>
                <CardContent className="flex-1">{activeSub}
                </CardContent>
                <CardContent className="flex-1">
                  {inactiveSub}
                </CardContent>
                <CardContent className="flex-1">
                  {countryCount}
                </CardContent>
              </div>
            <div className="-my-[3vh]">
            <DateDisplay />
            </div>
            </Card>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1/4">
            <DonutChart chartData={countryData} />
          </div>
          <div className="flex-2/3">
            <SubsAreaChart chartData={newSubs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
