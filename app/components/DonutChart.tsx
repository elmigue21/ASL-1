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

interface CountryData {
  country: string;
  count: number;
  fill?: string;
}

interface DonutChartProps {
  chartData: CountryData[];
  chartWidthVW?: number;
  chartHeightVH?: number;
  innerRadiusVW?: number;
  labelFontSize?: string;
  secondaryLabelFontSize?: string;
  cardHeader?: string;
  cardWidthVW?: number;
  cardHeightVH?: number;
  cardPaddingVW?: number;
  cardHeaderFontSize?: string;
  tspanFontSize?: string;
  cardHeaderFontSizeVH?: number; // Card header font size in vh
  tspanFontSizeVH?: number; // Tspan font size in vh
}

export function DonutChart({
  chartData,
  chartWidthVW,
  chartHeightVH,
  innerRadiusVW = 0,
  labelFontSize = "text-xl",
  secondaryLabelFontSize = "text-sm",
  cardHeader = "Countries Subscribers",
  cardWidthVW,
  cardHeightVH,
  cardPaddingVW = 0,
  cardHeaderFontSize = "text-base",
  tspanFontSize = "text-base",
  cardHeaderFontSizeVH,
  tspanFontSizeVH,
}: DonutChartProps) {
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
    <Card
      className="flex flex-col shadow-none border-0"
      style={{
        width: cardWidthVW ? `${cardWidthVW}vw` : undefined,
        height: cardHeightVH ? `${cardHeightVH}vh` : undefined,
        padding: cardPaddingVW ? `${cardPaddingVW}vw` : undefined,
      }}
    >
      <CardHeader
        className={`font-bold ${cardHeaderFontSize}`}
        style={{ fontSize: cardHeaderFontSizeVH ? `${cardHeaderFontSizeVH}vh` : undefined }}
      >
        {cardHeader}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square"
          style={{
            width: chartWidthVW ? `${chartWidthVW}vw` : undefined,
            height: chartHeightVH ? `${chartHeightVH}vh` : undefined,
          }}
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
              innerRadius={innerRadiusVW ? `${innerRadiusVW}%` : 60}
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
                          className={`fill-foreground font-bold ${labelFontSize} ${tspanFontSize}`}
                          style={{ fontSize: tspanFontSizeVH ? `${tspanFontSizeVH}vh` : undefined }}
                        >
                          Subscribers
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className={`fill-muted-foreground ${secondaryLabelFontSize} ${tspanFontSize}`}
                          style={{ fontSize: tspanFontSizeVH ? `${tspanFontSizeVH}vh` : undefined }}
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