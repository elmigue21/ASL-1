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

const fetchCountryCount = async () => {
  const {data:sessionData,error} = await supabase.auth.getSession(); // Get session
  const token = sessionData.session?.access_token; // Get access token

  console.log('token', token);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/countrycount`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach token in request
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("Countries:", data);
};
  // useEffect(()=>{
  //   fetchCountryCount()
  // })

  return (
    <>
      <Navbar />

      <div className="z-45 fixed top-25 left-40 w-8/9 h=2/3">
        <div
          className="m-10"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          <Button onClick={async ()=>{signIn('user@example.com','12345'); console.log('sign in')}}>qwe</Button>
          <Button onClick={()=>{fetchCountryCount()}}>eeee</Button>
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
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">10,240</CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">7,036
                </CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">
                  3,204
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
            <DonutChart />
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
