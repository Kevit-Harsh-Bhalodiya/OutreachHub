import { TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { RootState } from '@/redux/store';

interface User {
  createdAt: string;
}

type MonthlyData = {
  month: string;
  desktop: number;
};

export const description = 'A radar chart';

const chartConfig = {
  desktop: {
    label: 'Users',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ChartRadarDefault() {
  const { user: users, loading } = useSelector((state: RootState) => state.user);

  if (loading) {
    return (
      <Card className="flex h-[433px] w-full items-center justify-center sm:w-1/2">
        <CardDescription>Loading Chart Data...</CardDescription>
      </Card>
    );
  }

  if (!Array.isArray(users)) {
    return (
      <Card className="flex h-[433px] w-full items-center justify-center sm:w-1/2">
        <CardDescription>No user data available.</CardDescription>
      </Card>
    );
  }

  const chartData = users.reduce(
    (acc: MonthlyData[], person: User) => {
      if (!person.createdAt) return acc;
      const date = new Date(person.createdAt);
      const month = date.toLocaleString('default', { month: 'long' });

      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.desktop += 1;
      } else {
        acc.push({ month, desktop: 1 });
      }
      return acc;
    },
    [] as MonthlyData[],
  );

  // Use the correct type for the sort parameters
  chartData.sort((a: MonthlyData, b: MonthlyData) => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  const latestMonth = chartData[chartData.length - 1]?.desktop || 0;
  const previousMonth = chartData[chartData.length - 2]?.desktop || 0;
  const trend =
    previousMonth > 0
      ? (((latestMonth - previousMonth) / previousMonth) * 100).toFixed(1)
      : '0';

  const firstMonth = chartData[0]?.month || '';
  const lastMonth = chartData[chartData.length - 1]?.month || '';

  return (
    <Card className="w-full sm:w-1/2">
      <CardHeader className="items-center pb-4">
        <CardTitle>User Registrations by Month</CardTitle>
        <CardDescription>
          Showing total new users registered per month
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
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
        <div className="flex items-center gap-2 font-medium leading-none">
          {`Trending up by ${trend}% this month`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {firstMonth} - {lastMonth}
        </div>
      </CardFooter>
    </Card>
  );
}
