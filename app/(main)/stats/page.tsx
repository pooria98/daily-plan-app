"use client";
import axiosInstance from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import { DonutChart, DonutChartCell } from "@mantine/charts";
import { Activities } from "@/types/types";
import { useEffect, useState } from "react";
import { Group, LoadingOverlay } from "@mantine/core";

const mantineColors = [
  "cyan",
  "red",
  "teal",
  "pink",
  "green",
  "grape",
  "lime",
  "violet",
  "yellow",
  "indigo",
  "orange",
  "blue",
  "gray",
];

export default function StatsPage() {
  const [chartData, setChartData] = useState<DonutChartCell[]>([]);
  const [earliestDate, setEarliestDate] = useState<Date | undefined>(undefined);
  const [totalTime, setTotalTime] = useState<string | undefined>(undefined);

  const { data, isSuccess, isLoading } = useQuery<Activities[]>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/stats");
      return response.data;
    },
  });

  useEffect(() => {
    if (isSuccess && data.length > 0) {
      // set chart data
      const chartData = data.map((item, index) => ({
        name: item.name,
        value: item.hour,
        color: mantineColors[index % mantineColors.length],
      }));
      setChartData(chartData);

      // set earliest date
      const earliestActivity = data.reduce((earliest, current) => {
        if (earliest.createdAt! < current.createdAt!) {
          return earliest;
        } else {
          return current;
        }
      }, data[0]);
      const dateString = earliestActivity?.createdAt;
      const dateObject = new Date(dateString!);
      setEarliestDate(dateObject);

      // set total time
      const milliseconds = new Date().getTime() - dateObject.getTime();
      const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
      const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
      const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
      if (days <= 0) {
        if (hours <= 0) {
          setTotalTime(`${minutes} minutes`);
        } else {
          setTotalTime(`${hours} hours`);
        }
      } else {
        setTotalTime(`${days} days`);
      }
    } else {
      setChartData([]);
      setEarliestDate(undefined);
      setTotalTime(undefined);
    }
  }, [isSuccess, data]);

  return (
    <div className="relative w-full max-w-[600px] min-h-[600px] mx-auto flex flex-col justify-start pt-20">
      <LoadingOverlay visible={isLoading} overlayProps={{ bg: "transparent", blur: 5 }} />
      <h1 className="text-2xl font-semibold mb-10">Lifetime Stats</h1>
      <div className=" mb-8 flex flex-col gap-2">
        <p>
          First activity:{" "}
          <span className="font-semibold dark:text-white">{earliestDate?.toDateString()}</span>
        </p>
        <p>
          Today: <span className="font-semibold dark:text-white">{new Date().toDateString()}</span>
        </p>
        <p>
          Total Time: <span className="font-semibold dark:text-white">{totalTime}</span>
        </p>
      </div>
      <div className="mx-auto py-10 mb-8">
        <DonutChart
          data={chartData}
          withLabels
          withLabelsLine
          labelsType="percent"
          paddingAngle={1}
          thickness={30}
          size={200}
          tooltipDataSource="segment"
          valueFormatter={(value) => `${value} hours`}
        />
      </div>
      <div>
        {chartData.map((item, index) => (
          <Group
            key={index}
            justify="space-between"
            style={{ borderLeft: `8px solid var(--mantine-color-${item.color}-filled)` }}
            p="xs"
            mb="xs"
            className="bg-neutral-100 dark:bg-[#333] font-semibold rounded-sm"
          >
            <p>{item.name}</p>
            <p>{item.value} hours</p>
          </Group>
        ))}
      </div>
    </div>
  );
}
