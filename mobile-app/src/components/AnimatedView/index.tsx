import { ReactNode } from "react";
import Animated from "react-native-reanimated";

import { animationMap, AnimationName } from "./animationMap";

type AnimatedViewProps = {
  children: ReactNode;
  animation?: AnimationName;
  duration?: number;
  delay?: number;
};

export const AnimatedView = ({
  children,
  animation = "fadeInRight",
  duration = 500,
  delay = 0,
}: AnimatedViewProps) => {
  const selectedAnimation = animationMap[animation];
  const animationWithConfig = selectedAnimation.duration(duration).delay(delay);

  return (
    <Animated.View entering={animationWithConfig}>{children}</Animated.View>
  );
};

export type { AnimationName };
