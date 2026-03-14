import { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { G, Path } from "react-native-svg";

import { generateArcPath } from "./utils";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

type ArcSegmentProps = {
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  strokeWidth: number;
  delay?: number;
};

export const ArcSegment = ({
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color,
  strokeWidth,
  delay = 0,
}: ArcSegmentProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 1000,
      })
    );
  }, [delay, progress]);

  const path = generateArcPath(centerX, centerY, radius, startAngle, endAngle);

  // Calcular o comprimento do path para a animação
  const angleRange = endAngle - startAngle;
  const circumference = 2 * Math.PI * radius;
  const pathLength = (angleRange / 360) * circumference;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: pathLength * (1 - progress.value),
    };
  });

  const groupAnimatedProps = useAnimatedProps(() => {
    return {
      opacity: progress.value,
    };
  });

  return (
    <AnimatedG animatedProps={groupAnimatedProps}>
      {/* Camada de glow sutil (sem blur) */}
      <AnimatedPath
        d={path}
        stroke={color}
        strokeWidth={strokeWidth + 4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${pathLength} ${pathLength}`}
        animatedProps={animatedProps}
        opacity={0.3}
      />
      {/* Arco principal */}
      <AnimatedPath
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${pathLength} ${pathLength}`}
        animatedProps={animatedProps}
      />
    </AnimatedG>
  );
};
