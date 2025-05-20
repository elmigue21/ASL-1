"use client";
// import {supabase} from "@/lib/supabase";

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
// import { useState, useEffect } from "react";
import Image from "next/image";

interface CountryDataProps{
  country: string;
  count: number;
}

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

export function CountryBarChart({ countryData,expandClickedAction }: { countryData: CountryDataProps[], expandClickedAction: () => void }) {
  
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="relative">
          Subscribers by Country
          {/* <button onClick={()=>{console.log('qweqwe')}}>q</button> */}
          <Image
            src="/expand-arrows-alt.png"
            alt="Expand"
            width={15}
            height={15}
            className="absolute right-2 top-2 hover:cursor-pointer"
            onClick={() => {
              console.log("qweqweqwe");
              // togglePopup();
              expandClickedAction();
            }}
          />
        </CardTitle>
        <CardDescription>Top Subscriber Countries</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] overflow-y-scroll">
        <ChartContainer
          config={chartConfig}
          className=""
        >
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
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
