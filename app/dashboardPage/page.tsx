'use client'
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DonutChart } from "../components/DonutChart";
import { SubsAreaChart } from "../components/SubsAreaChart";
import Navbar from "../components/Navbar";
import DateDisplay from "../components/DateDisplay";
import { useState,useEffect } from "react";
import { signIn } from "@/utils/auth";
import { Button } from "@/components/ui/button";

import { supabase } from './../../lib/supabase';

const Dashboard = () => {

  const [countryCount, setCountryCount] = useState(0);
    const [totalSub, setTotalSub] = useState(0);
      const [activeSub, setActiveSub] = useState(0);
        const [inactiveSub, setInactiveSub] = useState(0);
        const [countryData, setCountryData] = useState([]);

const fetchCountryCount = async () => {
  const {data:sessionData,error} = await supabase.auth.getSession(); 
  const token = sessionData.session?.access_token; 


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/countrycount`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in request
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  setCountryCount(data.length);
  setCountryData(data);
  console.log("Countries:", data);
};

const fetchTotalSubs = async () => {
  const { data: sessionData, error } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) {
    return;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/subCount`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token in request
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  setTotalSub(data);
  console.log("total:", data);
};

const fetchInactiveSubs = async () => {
  const { data: sessionData, error } = await supabase.auth.getSession();
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
  console.log("inactive:", data);
};

const fetchActiveSubs = async () => {
  const { data: sessionData, error } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if(!token){
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
  console.log("active:", data);
};
  useEffect(()=>{
    fetchCountryCount()
    fetchActiveSubs();
    fetchInactiveSubs();
    fetchTotalSubs();
  },[])

  return (
    <>
      <Navbar/>

      <div className="z-45 fixed top-25 left-40 w-8/9 h=2/3">
        <div
          className="m-10"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          <div className="flex justify-evenly gap-1 h-40">
            <Card className="flex-1 p-4">
              <div className="flex">
                <CardHeader className="flex-1 text-center font-bold">
                  Total Subscribers
                </CardHeader>
                <CardHeader className="flex-1 text-center font-bold">
                  Active Subscribers
                </CardHeader>
                <CardHeader className="flex-1 text-center font-bold">
                  Inactive Subscribers
                </CardHeader>
                <CardHeader className="flex-1 text-center font-bold">
                  Countries
                </CardHeader>
              </div>
              <div className="flex">
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">{totalSub}</CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">{activeSub}
                </CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">
                  {inactiveSub}
                </CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">
                  {countryCount}
                </CardContent>
              </div>
            <div className="h-15 -mt-5">
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
            <SubsAreaChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
