import { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { CustomText } from "../CustomText";
import { LoadingSpinner } from "../LoadingSpinner";

import { cn } from "@/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface MainButtonProps {
  text?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const buttonVariants = {
  variant: {
    default:
      "bg-app-white border-2 border-neutral-400 flex-row items-center justify-center gap-2",
    secondary:
      "bg-app-gray-medium border border-light items-center justify-center",
    outline:
      "border-2 border-neutral-600 bg-transparent items-center justify-center",
    ghost: "bg-transparent items-center justify-center",
    link: "bg-transparent items-center justify-center",
  },
  size: {
    default: "p-3 rounded-2xl",
    sm: "p-2 rounded-xl",
    lg: "p-4 rounded-2xl",
    icon: "p-3 rounded-2xl",
  },
};

const textVariants = {
  variant: {
    default: "text-neutral-700",
    secondary: "text-neutral-300",
    outline: "text-neutral-300",
    ghost: "text-neutral-300",
    link: "text-neutral-300 underline",
  },
  size: {
    default: "text-xl",
    sm: "text-base",
    lg: "text-2xl",
    icon: "text-xl",
  },
};

export const MainButton = ({
  text,
  onPress,
  variant = "default",
  size = "default",
  icon,
  disabled = false,
  className,
  isLoading = false,
}: MainButtonProps) => {
  const buttonClass = cn(
    "w-full",
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    disabled && "opacity-50",
    className
  );

  const textClass = cn(
    "text-center",
    textVariants.variant[variant],
    textVariants.size[size]
  );

  return (
    <Pressable onPress={onPress} disabled={disabled} className={buttonClass}>
      {icon && <View>{icon}</View>}
      {text && !isLoading && (
        <CustomText className={textClass}>{text}</CustomText>
      )}
      {isLoading && (
        <LoadingSpinner
          size={24}
          cornerRadius={12}
          colors={["#000", "#fff", "#000"]}
          animationSpeed={7}
        />
      )}
    </Pressable>
  );
};
