import { View } from "react-native";
import AnimatedGlow from "react-native-animated-glow";

import { neonAnimation } from "@/constants";

type LoadingSpinnerProps = {
  size?: number;
  cornerRadius?: number;
  animationSpeed?: number;
  colors?: string[];
};

export const LoadingSpinner = ({
  size = 24,
  cornerRadius = 12,
  animationSpeed = 1.5,
  colors = [
    "rgba(255, 255, 255, 0.3)",
    "rgba(200, 210, 220, 0.2)",
    "rgba(0, 0, 0, 0)",
  ],
}: LoadingSpinnerProps) => {
  const neonAnimationConfig = neonAnimation({
    cornerRadius,
    animationSpeed,
    colors,
  });
  return (
    <AnimatedGlow
      preset={neonAnimationConfig}
      style={{ width: size, height: size }}
    >
      <View />
    </AnimatedGlow>
  );
};
