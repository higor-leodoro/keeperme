import { ReactNode } from "react";
import { Text } from "react-native";

import { cn } from "@/utils/cn";

type CustomTextProps = {
  children: ReactNode;
  className?: string;
};

export const CustomText = ({ children, className }: CustomTextProps) => {
  return (
    <Text className={cn("text-neutral-200 text-xl", className)}>
      {children}
    </Text>
  );
};
