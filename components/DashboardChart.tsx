"use client";
import { Status } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { motion } from "framer-motion";

interface dataProps {
  data: dataElements[];
}

interface dataElements {
  name: Status;
  total: number;
}

const statusColors = {
  OPEN: "#f87171",
  PENDING: "#60a5fa",
  SOLVED: "#34d399",
};

const chartConfig = {
  OPEN: {
    label: "Open",
    color: "hsl(var(--chart-1))",
  },
  PENDING: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  SOLVED: {
    label: "Solved",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-black p-2 border border-gray-300 rounded shadow-lg">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro">{`Total: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const DashboardChart = ({ data }: dataProps) => {
  const handleClick = (data: any, index: number) => {
    console.log(`Clicked on bar: ${data.name} with total: ${data.total}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Ticket Counts</CardTitle>
          <CardDescription>Overview of ticket counts by status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                radius={8}
                onClick={handleClick}
                name="Ticket Counts"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Total tickets by status <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Displaying the number of tickets for each status
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DashboardChart;
