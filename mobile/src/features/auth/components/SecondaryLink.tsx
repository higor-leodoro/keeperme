import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  align?: 'left' | 'center' | 'right';
  tone?: 'default' | 'mono';
};

export function SecondaryLink({
  label,
  onPress,
  disabled = false,
  align = 'center',
  tone = 'default',
}: Props) {
  const alignClass =
    align === 'right'
      ? 'self-end'
      : align === 'left'
        ? 'self-start'
        : 'self-center';

  const textClass =
    tone === 'mono'
      ? 'font-mono text-caption uppercase tracking-mono-wide'
      : 'font-body-medium text-[13px] leading-[18px] underline';

  const colorClass = disabled ? 'text-text-mute' : 'text-text-primary';

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : onPress}
      className={`py-1 ${alignClass} ${disabled ? '' : 'active:opacity-60'}`}
      hitSlop={6}
    >
      <Text className={`${textClass} ${colorClass}`}>{label}</Text>
    </Pressable>
  );
}
