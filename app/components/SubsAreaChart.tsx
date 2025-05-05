"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState,useEffect } from "react"

const chartConfig = {
  count: {
    label: "Subscribers",
    color: "#1A2B88",
  },
} satisfies ChartConfig
import { supabase } from "@/lib/supabase"

interface ChartDataProps {
  day: Date,
  count:number,
}


export function SubsAreaChart(/* {chartData} : {chartData:ChartDataProps[]} */) {
  // console.log('CHART DATAAAAAA', chartData)

  const [newSubs, setNewSubs] = useState<{ date: Date; subscriber_count: number }[]>([]);

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
    console.log("datga",data)
    setNewSubs(data);
  };

useEffect(()=>{
  fetchNewSubs()
},[])
  return (
    <Card className="shadow-none border-0">
      <CardHeader>
        <CardTitle className="font-bold">New Subscribers</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ChartContainer
          config={chartConfig}
          style={{ width: "100%", height: "150%" }}
        >
          <AreaChart
            accessibilityLayer
            data={newSubs}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>  {
                const date = new Date(value);
                const month = date.toLocaleString("default", {
                  month: "short",
                }); // e.g., "Mar"
                const day = date.getDate(); // e.g., 31
                return `${month} ${day}`; // "Mar 31"
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="subscriber_count"
              type="linear"
              fill="blue"
              fillOpacity={0.1}
              stroke="#1A2B88"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
