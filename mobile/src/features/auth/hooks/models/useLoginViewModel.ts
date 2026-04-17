import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/app/router/types';

type AuthNavigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLoginViewModel() {
  const navigation = useNavigation<AuthNavigation>();

  const handleAppleLogin = () => {
    console.log('apple');
  };

  const handleGoogleLogin = () => {
    console.log('google');
  };

  const goToLoginEmail = () => {
    navigation.navigate('LoginEmail');
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return { handleAppleLogin, handleGoogleLogin, goToLoginEmail, goToSignup };
}
