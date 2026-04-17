import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import type { AuthStackParamList } from '@/app/router/types';
import { validateEmail } from '../../utils/validators';

type AuthNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export function useForgotPasswordViewModel() {
  const navigation = useNavigation<AuthNavigation>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && !loading,
    [email, loading],
  );

  const submit = () => {
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setLoading(true);
    // TODO: backend — POST /auth/forgot-password
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VerifyCode', {
        email: email.trim(),
        flow: 'reset',
      });
    }, 400);
  };

  const goBack = () => navigation.goBack();

  return {
    email,
    setEmail,
    error,
    loading,
    canSubmit,
    submit,
    goBack,
  };
}
