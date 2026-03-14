import { FadeInRight, SlideInDown, SlideInUp } from "react-native-reanimated";

export const animationMap = {
  fadeInRight: FadeInRight,
  slideInDown: SlideInDown,
  slideInUp: SlideInUp,
};

export type AnimationName = keyof typeof animationMap;
