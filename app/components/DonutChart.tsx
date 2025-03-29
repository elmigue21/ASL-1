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
// const chartData = [
//   { country: "Philippines", visitors: 160, fill: "" },
//   { country: "Japan", visitors: 5860, fill: "" },
//   { country: "South Korea", visitors: 463, fill: "" },
//   { country: "China", visitors: 173, fill: "" },
//   { country: "Other", visitors: 190, fill: "" },
// ];


interface CountryData {
  country: string;
  count: number;
  fill?: string;
}

interface DonutChartProps {
  chartData: CountryData[];
}

export function DonutChart({ chartData }: DonutChartProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    chartData.forEach((item) => {
      item.fill = getRandomColor();
    });
  }
  const chartConfig: ChartConfig = React.useMemo(
    () =>
      chartData.reduce((config, item) => {
        config[item.country.toLowerCase().replace(/\s/g, "_")] = {
          label: item.country,
          color: item.fill,
        };
        return config;
      }, {} as ChartConfig),
    [chartData]
  );

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
              dataKey="count"
              nameKey="country"
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
