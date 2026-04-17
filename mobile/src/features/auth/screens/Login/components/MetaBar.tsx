import { useEffect } from 'react';
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

const ITEMS = ['V1.0.0', 'BUILD A8F2', 'PT-BR'];

export function MetaBar() {
  const reveal = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      reveal.value = 1;
      return;
    }
    reveal.value = withDelay(
      1400,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, [reducedMotion, reveal]);

  const style = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: interpolate(reveal.value, [0, 1], [14, 0]) }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute bottom-8 left-0 right-0 flex-row items-center justify-center gap-2"
      style={style}
    >
      {ITEMS.map((item, idx) => (
        <View key={item} className="flex-row items-center gap-2">
          <Text
            className="font-mono text-caption-xs uppercase text-text-mute tracking-mono-wide"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {item}
          </Text>
          {idx < ITEMS.length - 1 ? (
            <Text className="font-mono text-caption-xs text-text-dim tracking-mono-wide">
              ·
            </Text>
          ) : null}
        </View>
      ))}
    </Animated.View>
  );
}
