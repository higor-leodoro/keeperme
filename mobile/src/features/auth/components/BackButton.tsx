import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type Props = {
  label?: string;
  onPress: () => void;
};

export function BackButton({ label = 'voltar', onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="self-start active:opacity-60"
      hitSlop={12}
    >
      <View className="flex-row items-center gap-1.5">
        <ChevronLeft
          size={14}
          strokeWidth={1.5}
          color="rgba(245,240,232,0.55)"
        />
        <Text className="font-mono text-caption uppercase text-text-secondary tracking-mono-wide">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
