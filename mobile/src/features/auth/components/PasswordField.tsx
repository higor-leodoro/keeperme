import { Eye, EyeOff } from 'lucide-react-native';
import { forwardRef, useState } from 'react';
import { Pressable, TextInput, TextInputProps } from 'react-native';
import { TextField } from './TextField';

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  error?: string | null;
  hint?: string;
};

export const PasswordField = forwardRef<TextInput, Props>(
  function PasswordField({ label, error, hint, ...inputProps }, ref) {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
      <TextField
        ref={ref}
        label={label}
        error={error}
        hint={hint}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        rightSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'ocultar senha' : 'mostrar senha'}
            onPress={() => setVisible((prev) => !prev)}
            hitSlop={8}
            className="active:opacity-60"
          >
            <Icon
              size={16}
              strokeWidth={1.5}
              color="rgba(245,240,232,0.55)"
            />
          </Pressable>
        }
        {...inputProps}
      />
    );
  },
);
