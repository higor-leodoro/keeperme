import {
  CommonActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import type {
  AuthStackParamList,
  RootStackParamList,
} from '@/app/router/types';

const INITIAL_SECONDS = 300;
const CODE_LENGTH = 6;

type AuthNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  'VerifyCode'
>;
type VerifyRoute = RouteProp<AuthStackParamList, 'VerifyCode'>;

export function useVerifyCodeViewModel() {
  const navigation = useNavigation<AuthNavigation>();
  const route = useRoute<VerifyRoute>();
  const { email, flow } = route.params;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [resendPulse, setResendPulse] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resendPulse]);

  const timerLabel = formatTimer(seconds);
  const canResend = seconds === 0;

  const handleChange = (value: string) => {
    setCode(value);
    if (error) setError(null);
  };

  const handleComplete = (value: string) => {
    setLoading(true);
    // TODO: backend — POST /auth/verify-code
    setTimeout(() => {
      setLoading(false);
      // mock: códigos com todos dígitos iguais falham
      if (/^(\d)\1{5}$/.test(value)) {
        setError('código inválido · tente novamente');
        setCode('');
        return;
      }
      if (flow === 'signup') {
        const root =
          navigation.getParent<
            NativeStackNavigationProp<RootStackParamList>
          >();
        root?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'App' }],
          }),
        );
      } else {
        navigation.navigate('ResetPassword', { email });
      }
    }, 500);
  };

  const submit = () => {
    if (code.length !== CODE_LENGTH) {
      setError(`digite os ${CODE_LENGTH} dígitos`);
      return;
    }
    handleComplete(code);
  };

  const resend = () => {
    if (!canResend) return;
    setCode('');
    setError(null);
    setSeconds(INITIAL_SECONDS);
    setResendPulse((prev) => prev + 1);
    // TODO: backend — POST /auth/resend-code
  };

  const goBack = () => navigation.goBack();

  return {
    email,
    flow,
    code,
    handleChange,
    handleComplete,
    submit,
    error,
    loading,
    timerLabel,
    canResend,
    resend,
    goBack,
  };
}

function formatTimer(total: number): string {
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
}
