import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import type {
  AuthStackParamList,
  RootStackParamList,
} from '@/app/router/types';
import { validateEmail, validatePassword } from '../../utils/validators';

type AuthNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  'LoginEmail'
>;

type FieldErrors = {
  email?: string | null;
  password?: string | null;
};

export function useLoginEmailViewModel() {
  const navigation = useNavigation<AuthNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0 && !loading,
    [email, password, loading],
  );

  const submit = () => {
    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    // TODO: backend — POST /auth/login
    setTimeout(() => {
      setLoading(false);
      const root =
        navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      root?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'App' }],
        }),
      );
    }, 400);
  };

  const goToForgotPassword = () => navigation.navigate('ForgotPassword');
  const goToSignup = () => navigation.navigate('Signup');
  const goBack = () => navigation.goBack();

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    canSubmit,
    submit,
    goToForgotPassword,
    goToSignup,
    goBack,
  };
}
