import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  autoFocus?: boolean;
};

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  autoFocus = true,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = value.padEnd(length, ' ').slice(0, length).split('');
  const activeIndex = Math.min(value.length, length - 1);

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/\D+/g, '').slice(0, length);
    onChange(cleaned);
    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  return (
    <Pressable
      accessibilityRole="none"
      onPress={() => inputRef.current?.focus()}
      className="w-full"
    >
      <View className="flex-row justify-center gap-2">
        {digits.map((char, index) => {
          const isActive = focused && index === activeIndex;
          const borderClass = error
            ? 'border-negative'
            : isActive
              ? 'border-border-strong'
              : 'border-border';
          return (
            <View
              key={index}
              className={`h-[52px] w-[42px] items-center justify-center rounded-sm border bg-bg-elevated ${borderClass}`}
            >
              <Text
                className="font-display-medium text-hero-sm text-text-primary"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {char.trim()}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        textContentType="oneTimeCode"
        accessibilityLabel="código de verificação"
        style={{
          position: 'absolute',
          opacity: 0,
          width: '100%',
          height: 52,
        }}
      />
    </Pressable>
  );
}
