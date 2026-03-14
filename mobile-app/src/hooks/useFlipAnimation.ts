import {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface UseFlipAnimationOptions {
  duration?: number;
  perspective?: number;
}

export const useFlipAnimation = (options: UseFlipAnimationOptions = {}) => {
  const { duration = 600, perspective = 1000 } = options;
  const isFlipped = useSharedValue(0);

  const flip = () => {
    isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, {
      duration,
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180]);

    return {
      transform: [{ perspective }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360]);

    return {
      transform: [{ perspective }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const frontAnimatedProps = useAnimatedProps(() => {
    return {
      pointerEvents:
        isFlipped.value < 0.5 ? ("auto" as const) : ("none" as const),
    };
  });

  const backAnimatedProps = useAnimatedProps(() => {
    return {
      pointerEvents:
        isFlipped.value >= 0.5 ? ("auto" as const) : ("none" as const),
    };
  });

  return {
    isFlipped,
    flip,
    frontAnimatedStyle,
    backAnimatedStyle,
    frontAnimatedProps,
    backAnimatedProps,
  };
};
