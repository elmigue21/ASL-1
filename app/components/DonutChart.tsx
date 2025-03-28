"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { getRandomColor } from "@/utils/randomColorGenerator";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "Philippines", visitors: 160, fill: "" },
  { browser: "Japan", visitors: 5860, fill: "" },
  { browser: "South Korea", visitors: 463, fill: "" },
  { browser: "China", visitors: 173, fill: "" },
  { browser: "Other", visitors: 190, fill: "" },
];


const chartConfig = {
  chrome: {
    label: "Philippines",
    color: "",
  },
  safari: {
    label: "Japan",
    color: "",
  },
  firefox: {
    label: "South Korea",
    color: "",
  },
  edge: {
    label: "China",
    color: "",
  },
  other: {
    label: "Other",
    color: "",
  },
} satisfies ChartConfig;



export function DonutChart() {

    const [isClient, setIsClient] = React.useState(false);
 React.useEffect(() => {
   setIsClient(true);
 }, []);

    if (isClient) {
      chartData.forEach((item) => {
        item.fill = getRandomColor();
      });

      Object.values(chartConfig).forEach((config) => {
        config.color = getRandomColor();
      });
    }


  return (
    <Card className="flex flex-col shadow-none border-0">
<CardHeader className="font-bold">Countries Subscribers</CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {/* {totalVisitors.toLocaleString()} */}
                          Subscribers
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          per country
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
