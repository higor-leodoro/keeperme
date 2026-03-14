import { CategoryEnum } from "@/types/category";

export type ArcSegment = {
  category: CategoryEnum;
  value: number;
  percentage: number;
  color: string;
  startAngle: number;
  endAngle: number;
};

export type RadialChartData = {
  category: CategoryEnum;
  value: number;
  color: string;
};
