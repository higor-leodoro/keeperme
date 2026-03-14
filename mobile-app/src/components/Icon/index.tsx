import { View } from "react-native";

import { getIcon, IconName } from "./iconMap";

import { colors, ColorValue } from "@/constants/";
import { cn } from "@/utils";

type IconProps = {
  name: IconName;
  color?: ColorValue;
  size?: number;
  withBackground?: boolean;
  backgroundColor?: ColorValue;
  containerSize?: number;
  className?: string;
  strokeWidth?: number;
};

export const Icon = ({
  name,
  color = colors.palette.white,
  size = 24,
  withBackground = false,
  backgroundColor = "rgba(0, 0, 0, 0.3)",
  containerSize = 48,
  className,
  strokeWidth = 2,
}: IconProps) => {
  const IconComponent = getIcon(name);

  if (withBackground) {
    const bgColor = backgroundColor || color;

    return (
      <View
        className={cn("items-center justify-center rounded-xl", className)}
        style={{
          width: containerSize,
          height: containerSize,
          backgroundColor: `${bgColor}`,
        }}
      >
        <IconComponent color={color} size={size} strokeWidth={1.2} />
      </View>
    );
  }

  return (
    <IconComponent
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};

export type { IconName };
