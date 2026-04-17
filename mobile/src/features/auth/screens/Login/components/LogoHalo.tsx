import { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const LOGO_SIZE = 350;
const HALO_SIZE = 280;

export function LogoHalo() {
  const reveal = useSharedValue(0);
  const breath = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      reveal.value = 1;
      breath.value = 0.5;
      return;
    }
    reveal.value = withDelay(
      200,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) }),
    );
    breath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [reducedMotion, reveal, breath]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ scale: interpolate(reveal.value, [0, 1], [0.9, 1]) }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [0.6, 1]),
    transform: [{ scale: interpolate(breath.value, [0, 1], [0.95, 1.05]) }],
  }));

  return (
    <View pointerEvents="none" className="items-center justify-center">
      <Animated.View
        className="absolute w-[280px] h-[280px]"
        style={haloStyle}
      >
        <Svg width={HALO_SIZE} height={HALO_SIZE}>
          <Defs>
            <RadialGradient
              id="halo"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop
                offset="0%"
                stopColor="rgb(200,210,230)"
                stopOpacity={0.1}
              />
              <Stop
                offset="100%"
                stopColor="rgb(200,210,230)"
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={HALO_SIZE}
            height={HALO_SIZE}
            fill="url(#halo)"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={logoStyle}>
        <Image
          source={require("@/assets/logo.png")}
          className="w-[350px] h-[350px] shadow-logo"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
