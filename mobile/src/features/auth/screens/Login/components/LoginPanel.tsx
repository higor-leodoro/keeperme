import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Mail } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { AppleIcon } from "./AppleIcon";
import { GoogleIcon } from "./GoogleIcon";

type Props = {
  onAppleLogin: () => void;
  onGoogleLogin: () => void;
  onEmailLogin: () => void;
  onSignup: () => void;
};

const GRADIENT_170 = { start: { x: 0, y: 0 }, end: { x: 0.17, y: 0.98 } };

export function LoginPanel({
  onAppleLogin,
  onGoogleLogin,
  onEmailLogin,
  onSignup,
}: Props) {
  const reveal = useSharedValue(0);
  const applePress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      reveal.value = 1;
      return;
    }
    reveal.value = withDelay(
      1100,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, [reducedMotion, reveal]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: interpolate(reveal.value, [0, 1], [14, 0]) }],
  }));

  const appleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(applePress.value, [0, 1], [1, 0.6]),
    transform: [{ scale: interpolate(applePress.value, [0, 1], [1, 0.97]) }],
  }));

  const handleApplePressIn = () => {
    applePress.value = withTiming(1, { duration: 120 });
  };
  const handleApplePressOut = () => {
    applePress.value = withTiming(0, { duration: 120 });
  };

  return (
    <Animated.View
      className="w-full max-w-[380px] self-center overflow-hidden rounded-xl border border-border shadow-panel"
      style={containerStyle}
    >
      <BlurView
        intensity={32}
        tint="dark"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.06)",
          "rgba(255,255,255,0.02)",
          "rgba(255,255,255,0.005)",
        ]}
        start={GRADIENT_170.start}
        end={GRADIENT_170.end}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View
        pointerEvents="none"
        className="absolute top-[-30%] left-[-10%] h-full w-[60%]"
      >
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient
              id="panel-glow"
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
              <Stop offset="55%" stopColor="rgb(200,210,230)" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill="url(#panel-glow)"
          />
        </Svg>
      </View>

      <View className="px-6 pt-6 pb-5.5">
        <View className="mb-4.5 flex-row items-center justify-between">
          <Text className="font-display-medium text-body-lg text-text-primary">
            Entrar
          </Text>
          <Text
            className="font-mono text-caption uppercase text-text-hint tracking-mono-wide"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            AUTH · 01
          </Text>
        </View>

        <View className="gap-2.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continuar com Apple"
            onPress={onAppleLogin}
            onPressIn={handleApplePressIn}
            onPressOut={handleApplePressOut}
          >
            <Animated.View
              className="h-[52px] items-center justify-center overflow-hidden rounded-[14px] bg-accent shadow-button"
              style={appleStyle}
            >
              <View
                pointerEvents="none"
                className="absolute top-0 left-0 right-0 h-px bg-overlay-white-50"
              />
              <View className="flex-row items-center gap-2">
                <View className="w-5 items-center justify-center">
                  <AppleIcon size={25} color="#06060A" />
                </View>
                <Text className="font-display-medium text-body-md text-bg-base">
                  Continuar com Apple
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continuar com Google"
            onPress={onGoogleLogin}
            className="h-[52px] items-center justify-center overflow-hidden rounded-[14px] border border-border-glass active:opacity-60"
          >
            <BlurView
              intensity={10}
              tint="dark"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <View
              pointerEvents="none"
              className="absolute inset-0 bg-overlay-white-4"
            />
            <View className="flex-row items-center gap-2">
              <View className="w-5 items-center justify-center">
                <GoogleIcon size={20} />
              </View>
              <Text className="font-display-medium text-body-md text-text-primary">
                Continuar com Google
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="my-3.5 flex-row items-center gap-3">
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.1)", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1, height: 1 }}
          />
          <Text className="font-mono text-caption-xs uppercase text-text-ghost tracking-mono-widest">
            OU
          </Text>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.1)", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1, height: 1 }}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continuar com email"
          onPress={onEmailLogin}
          className="items-center py-3 active:opacity-60"
        >
          <View className="flex-row items-center gap-2">
            <Mail size={14} strokeWidth={1.5} color="rgba(245,240,232,0.55)" />
            <Text className="font-display text-body-sm text-text-soft">
              continuar com email
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Sou novo aqui"
          onPress={onSignup}
          className="mt-4 items-center border-t border-border-hair pt-4 active:opacity-60"
        >
          <Text className="font-body-medium text-[13px] leading-[18px] text-text-primary underline">
            Crie uma conta
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
