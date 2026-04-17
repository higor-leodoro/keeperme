import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import type { AuthStackParamList } from '@/app/router/types';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validators';

type AuthNavigation = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

type FieldErrors = {
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
};

export function useSignupViewModel() {
  const navigation = useNavigation<AuthNavigation>();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () =>
      name.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      !loading,
    [name, lastName, email, password, loading],
  );

  const submit = () => {
    const nextErrors: FieldErrors = {
      name: validateName(name, 'nome'),
      lastName: validateName(lastName, 'sobrenome'),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (
      nextErrors.name ||
      nextErrors.lastName ||
      nextErrors.email ||
      nextErrors.password
    ) {
      return;
    }

    setLoading(true);
    // TODO: backend — POST /auth/register (envia código de verificação)
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VerifyCode', {
        email: email.trim(),
        flow: 'signup',
      });
    }, 400);
  };

  const goBack = () => navigation.goBack();

  return {
    name,
    setName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    canSubmit,
    submit,
    goBack,
  };
}
