"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";

const chartConfig = {
  count: {
    label: "Subscribers",
    color: "#1A2B88",
  },
} satisfies ChartConfig;
// import { supabase } from "@/lib/supabase";
import { SubsComboBox } from "./SubsComboBox";
import { useNewSubDateRange } from "../context/NewSubDateRangeContext";

// interface ChartDataProps {
//   day: Date,
//   count:number,
// }

type SubData = {
  date: string; // "2025-05-03" or "2025-05"
  subscriber_count: number;
};

const generateDays = (numDays: number): string[] => {
  const days = [];
  const today = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split("T")[0]); // Format to "YYYY-MM-DD"
  }

  return days;
};

// Function to generate months for the past N months
const generateMonths = (numMonths: number): string[] => {
  const months = [];
  const today = new Date();

  for (let i = numMonths - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    months.push(date.toISOString().slice(0, 7)); // Format to "YYYY-MM"
  }

  return months;
};


// Normalize the data based on the date range (7d, 1m, 6m, 1y)
const normalizeData = (rawData: SubData[], range: "7d" | "1m" | "6m" | "1y") => {

  console.log('RAW DATA', rawData);
  // const labelFormatter = range === "7d" ? "day" : "month";

  let labels: string[] = [];
  if (range === "7d") {
    labels = generateDays(7); // 7 days
  } else if (range === "1m") {
    labels = generateDays(30); // 1 month
  } else if (range === "6m") {
    labels = generateMonths(6); // 6 months
  } else if (range === "1y") {
    labels = generateMonths(12); // 1 year
  }

  // Map raw data to a date value (default to 0 if missing)
const dataMap = new Map<string, number>();

rawData.forEach((d: SubData) => {
  let formattedDate = d.date;

  if (range === "7d" || range === "1m") {
    formattedDate = d.date.slice(0, 10); // "YYYY-MM-DD"
  } else if (range === "6m" || range === "1y") {
    formattedDate = d.date.slice(0, 7); // "YYYY-MM"
  }

  const prevCount = dataMap.get(formattedDate) || 0;
  dataMap.set(formattedDate, prevCount + (d.subscriber_count ?? 0));
});

  return labels.map((label) => ({
    date: label,
    subscriber_count: dataMap.get(label) ?? 0,
  }));
};

export function SubsAreaChart({
  titleClassName = "",
  cardContentClassName = "",
  xAxisClassName = "",
  yAxisClassName = "",
  chartMargin = { left: 12, right: 25, bottom: 19 },
  scbButton="",
  scbPopover="",
  scbCommandItem=""
}: {
  titleClassName?: string;
  cardContentClassName?: string;
  xAxisClassName?: string;
  yAxisClassName?: string;
  chartMargin?: { top?: number; right?: number; bottom?: number; left?: number };
  scbButton?: string;
  scbPopover?: string,
  scbCommandItem?: string
}) {
  const [newSubs, setNewSubs] = useState<SubData[]>([]);

  // const [dateRange, setDateRange] = useState<"7d" | "1m" | "6m" | "1y">("7d");
  const { dateRange /*  setDateRange */ } = useNewSubDateRange();

  const fetchNewSubs = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/newSubs/dateRange?dateRange=${dateRange}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    // console.log("NEW SUBS:", data);

    const filled = normalizeData(data, dateRange);
    console.log("normalized dataaa", filled);

    console.log("datga", data);
    setNewSubs(filled);
  };

  //  const { dateRange, setDateRange } = useNewSubDateRange();

  useEffect(() => {
    fetchNewSubs();
  }, [dateRange]);
  return (
    <Card className="shadow-none border-0">
      <CardHeader>
        <CardTitle className={`font-bold justify-between flex items-center text-[1vw] ${titleClassName}`}>
          <h1>New Subscribers</h1>
          <SubsComboBox 
          buttonClassName={`${scbButton}`}
          popoverContentClassName={`${scbPopover}`}
          commandItemClassName={`${scbCommandItem}`}

          />
        </CardTitle>
      </CardHeader>
      <CardContent className={`h-[26vh] w-[54vw] ${cardContentClassName}`}>
        <ChartContainer
          config={chartConfig}
          style={{ width: "100%", height: "150%" }}
        >
          <AreaChart
            accessibilityLayer
            data={newSubs}
            margin={chartMargin}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              className={`text-[0.6vw] overflow-visible ${xAxisClassName}`}
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-40}
              interval={0}
              tickFormatter={(value) => {
                // If the label is in YYYY-MM format, just show the month (and maybe year)
                if (value.length === 7) {
                  const [year, month] = value.split("-");
                  return new Date(
                    Number(year),
                    Number(month) - 1
                  ).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  }); // e.g., "May 2025"
                }

                // Else, it's a full date
                const date = new Date(value);
                const month = date.toLocaleString("default", {
                  month: "short",
                });
                const day = date.getDate();
                return `${month}${day} `; // e.g., "Mar 31"
              }}
            />
            <YAxis
              className={`text-[0.8vw] ${yAxisClassName}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5} // This hints the chart to use 5 ticks (adjust as needed)
              tickFormatter={(value) => `${value}`}
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
