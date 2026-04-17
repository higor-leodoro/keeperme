import { forwardRef, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  hint?: string;
  rightSlot?: React.ReactNode;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, rightSlot, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-negative'
    : focused
      ? 'border-border-strong'
      : 'border-border';

  return (
    <View className="w-full">
      <Text className="mb-2.5 font-mono text-caption uppercase text-text-hint tracking-mono-wide">
        {label}
      </Text>
      <View
        className={`h-12 flex-row items-center rounded-sm border bg-bg-elevated px-3.5 ${borderClass}`}
      >
        <TextInput
          ref={ref}
          className="flex-1 font-display text-body-md text-text-primary"
          placeholderTextColor="rgba(245,240,232,0.28)"
          selectionColor="#F5F0E8"
          accessibilityLabel={label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {rightSlot ? <View className="ml-2">{rightSlot}</View> : null}
      </View>
      {error ? (
        <Text className="mt-1.5 font-mono text-caption-xs text-negative tracking-mono-wide">
          {error}
        </Text>
      ) : hint ? (
        <Text className="mt-1.5 font-mono text-caption-xs text-text-ghost tracking-mono-wide">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
