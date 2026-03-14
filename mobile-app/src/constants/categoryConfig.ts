import { colors } from "./colors";

import { IconName } from "@/components";
import { CategoryEnum } from "@/types";

type CategoryConfig = {
  icon: IconName;
  color: string;
};

export const categoryConfig: Record<CategoryEnum, CategoryConfig> = {
  [CategoryEnum.HOUSE]: {
    icon: "home",
    color: colors.category.house,
  },
  [CategoryEnum.FOOD]: {
    icon: "soup",
    color: colors.category.food,
  },
  [CategoryEnum.TRANSPORT]: {
    icon: "car",
    color: colors.category.transport,
  },
  [CategoryEnum.HEALTH]: {
    icon: "heart",
    color: colors.category.health,
  },
  [CategoryEnum.EDUCATION]: {
    icon: "graduation-cap",
    color: colors.category.education,
  },
  [CategoryEnum.ENTERTAINMENT]: {
    icon: "gamepad2",
    color: colors.category.entertainment,
  },
  [CategoryEnum.FINANCE]: {
    icon: "dollar-sign",
    color: colors.category.finance,
  },
  [CategoryEnum.OTHERS]: {
    icon: "more-horizontal",
    color: colors.category.others,
  },
  [CategoryEnum.GROCERY]: {
    icon: "shopping-bag",
    color: colors.category.grocery,
  },
};

// Helper para obter configuração de uma categoria
export const getCategoryConfig = (category: CategoryEnum): CategoryConfig => {
  return categoryConfig[category];
};
