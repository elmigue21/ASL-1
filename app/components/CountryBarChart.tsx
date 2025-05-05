"use client";
import {supabase} from "@/lib/supabase";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
import Image from "next/image";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

import { usePopupContext } from "../context/PopupContext";



const chartConfig = {
  country: {
    label: "Country",
    color: "black"
  },
  label: {
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function CountryBarChart() {

  const [countryData, setCountryData] = useState<any[]>([]);

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

   let data = await response.json();
   data = data
     .map((item: any) => ({
       ...item,
       country: item.country?.trim() ? item.country : "N/A",
     }))
     .sort(
       (
         a: { country: string; count: number },
         b: { country: string; count: number }
       ) => b.count - a.count
     ); // Sort numerically based on count

   setCountryData(data);
   console.log("Countries:", data);
 };

  useEffect(()=>{
    fetchCountryCount();
  },[])
const { togglePopup } = usePopupContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="relative">Bar Chart - Custom Label
      <button onClick={()=>{console.log('qweqwe')}}>q</button>
          <Image
          src="/expand-arrows-alt.png"
          alt="Expand"
          width={15}
          height={15}
          className="absolute right-2 top-2 hover:cursor-pointer"
          onClick={() => {console.log('qweqweqwe');togglePopup()}}
          
          />
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={countryData}
            layout="vertical"
            margin={{
              right: 16,
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3).toUpperCase()}
              interval={0}
              // hide
            />

            <XAxis
              dataKey="count"
              type="number"
              hide
              className="hover:bg-red-500"
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
              className="hover:bg-red-500"
            >
              {/* <LabelList
                dataKey="country"
                position="left"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              /> */}
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
