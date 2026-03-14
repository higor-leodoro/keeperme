import { IconName } from "@/components";

export enum CategoryEnum {
  HOUSE = "HOUSE",
  FOOD = "FOOD",
  GROCERY = "GROCERY",
  TRANSPORT = "TRANSPORT",
  HEALTH = "HEALTH",
  EDUCATION = "EDUCATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  FINANCE = "FINANCE",
  OTHERS = "OTHERS",
}

export type CategorySummary = {
  category: CategoryEnum;
  value: number;
  icon: IconName;
};

export type Category = {
  id: string;
  name: CategoryEnum;
};
