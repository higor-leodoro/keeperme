import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  accessibilityLabel,
}: Props) {
  const press = useSharedValue(0);
  const isInactive = loading || disabled;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isInactive
      ? 0.4
      : interpolate(press.value, [0, 1], [1, 0.6]),
    transform: [
      { scale: interpolate(press.value, [0, 1], [1, 0.97]) },
    ],
  }));

  const handlePressIn = () => {
    if (isInactive) return;
    press.value = withTiming(1, { duration: 120 });
  };
  const handlePressOut = () => {
    if (isInactive) return;
    press.value = withTiming(0, { duration: 120 });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      onPress={isInactive ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className="h-[52px] items-center justify-center overflow-hidden rounded-[14px] bg-accent shadow-button"
        style={animatedStyle}
      >
        <View
          pointerEvents="none"
          className="absolute top-0 left-0 right-0 h-px bg-overlay-white-50"
        />
        {loading ? (
          <Text className="font-mono text-body-md text-bg-base tracking-mono-wide">
            •••
          </Text>
        ) : (
          <Text className="font-display-medium text-body-md text-bg-base">
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
