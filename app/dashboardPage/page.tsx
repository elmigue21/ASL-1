import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DonutChart } from "../components/DonutChart";
import { SubsAreaChart } from "../components/SubsAreaChart";
import Navbar from "../components/Navbar";
import DateDisplay from "../components/DateDisplay";

const Dashboard = () => {
  return (
    <>
      <Navbar />
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
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">10,240</CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">7,036
                </CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">
                  3,204
                </CardContent>
                <CardContent className="flex-1 text-4xl text-center font-bold text-blue-900">
                  19
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
