import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import type { AuthStackParamList } from '@/app/router/types';
import { validateMatch, validatePassword } from '../../utils/validators';

type AuthNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  'ResetPassword'
>;

type FieldErrors = {
  password?: string | null;
  confirm?: string | null;
};

export function useResetPasswordViewModel() {
  const navigation = useNavigation<AuthNavigation>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const meetsLength = password.length >= 6;
  const matches = password.length > 0 && password === confirm;

  const canSubmit = useMemo(
    () => meetsLength && matches && !loading,
    [meetsLength, matches, loading],
  );

  const submit = () => {
    const nextErrors: FieldErrors = {
      password: validatePassword(password),
      confirm: validateMatch(password, confirm),
    };
    setErrors(nextErrors);
    if (nextErrors.password || nextErrors.confirm) return;

    setLoading(true);
    // TODO: backend — POST /auth/reset-password
    setTimeout(() => {
      setLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    }, 500);
  };

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    errors,
    loading,
    canSubmit,
    meetsLength,
    matches,
    submit,
  };
}
