import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
// Assuming your Redux state has a users slice with the API data

export const description = "A radar chart";

const chartConfig = {
  desktop: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartRadarDefault() {
  // Get user data from Redux store
  const users = useSelector((state: RootState) => state.user.user);

  const chartData = users.reduce(
    (acc: any, user: any) => {
      const date = new Date(user.createdAt);
      const month = date.toLocaleString("default", { month: "long" });
      const existing = acc.find((item: any) => item.month === month);
      if (existing) {
        existing.desktop += 1;
      } else {
        acc.push({ month, desktop: 1 });
      }
      return acc;
    },
    [] as { month: string; desktop: number }[],
  );

  // Sort data by date to ensure chronological order
  chartData.sort((a: any, b: any) => {
    const dateA = new Date(a.month + " 1, 2025");
    const dateB = new Date(b.month + " 1, 2025");
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate trend for footer
  const latestMonth = chartData[chartData.length - 1]?.desktop || 0;
  const previousMonth = chartData[chartData.length - 2]?.desktop || 0;
  const trend =
    previousMonth > 0
      ? (((latestMonth - previousMonth) / previousMonth) * 100).toFixed(1)
      : 0;

  // Get date range for footer
  const firstMonth = chartData[0]?.month || "";
  const lastMonth = chartData[chartData.length - 1]?.month || "";

  return (
    <Card className="w-[100%] sm:w-[50%] ">
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto  max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {`Trending up by ${trend}% this month`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {firstMonth} - {lastMonth}
        </div>
      </CardFooter>
    </Card>
  );
}
