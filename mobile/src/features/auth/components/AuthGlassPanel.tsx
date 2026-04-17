import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  revealDelay?: number;
};

const GRADIENT_170 = { start: { x: 0, y: 0 }, end: { x: 0.17, y: 0.98 } };

export function AuthGlassPanel({
  children,
  eyebrow,
  title,
  revealDelay = 200,
}: Props) {
  const reveal = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      reveal.value = 1;
      return;
    }
    reveal.value = withDelay(
      revealDelay,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, [reducedMotion, reveal, revealDelay]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: interpolate(reveal.value, [0, 1], [14, 0]) }],
  }));

  return (
    <Animated.View
      className="w-full max-w-[380px] self-center overflow-hidden rounded-xl border border-border shadow-panel"
      style={containerStyle}
    >
      <BlurView
        intensity={32}
        tint="dark"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.06)',
          'rgba(255,255,255,0.02)',
          'rgba(255,255,255,0.005)',
        ]}
        start={GRADIENT_170.start}
        end={GRADIENT_170.end}
        style={{
          position: 'absolute',
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
        {(eyebrow || title) && (
          <View className="mb-4.5">
            {eyebrow ? (
              <Text
                className="font-mono text-caption uppercase text-text-hint tracking-mono-wide"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {eyebrow}
              </Text>
            ) : null}
            {title ? (
              <Text className="mt-2 font-display-medium text-hero-sm text-text-primary">
                {title}
              </Text>
            ) : null}
          </View>
        )}
        {children}
      </View>
    </Animated.View>
  );
}
