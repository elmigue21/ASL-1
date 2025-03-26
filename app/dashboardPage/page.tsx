import React from 'react'

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {DonutChart} from '../components/DonutChart';
import {SubsAreaChart} from '../components/SubsAreaChart'
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="z-45 fixed top-25 left-40 w-7/8 h=2/3">
        <div
          className="m-10"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          <div className="flex justify-evenly gap-20">
            <Card className="flex-1">
              <CardHeader className="font-bold">Total Subscribers</CardHeader>
              <CardContent className="text-4xl text-center text-blue-900 font-bold">
                40,000
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="font-bold">Active Subscribers</CardHeader>
              <CardContent className="text-4xl text-center font-bold text-blue-900">
                40,000
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="font-bold">
                Inactive Subscribers
              </CardHeader>
              <CardContent className="text-4xl text-center font-bold text-blue-900">
                40,000
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="font-bold">Countries</CardHeader>
              <CardContent className="text-4xl text-center font-bold text-blue-900">
                40,000
              </CardContent>
            </Card>
          </div>
          <h1>Wed, Jul 20</h1>
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
}

export default Dashboard