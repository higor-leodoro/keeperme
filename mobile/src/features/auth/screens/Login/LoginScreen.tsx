import { View } from 'react-native';
import { useLoginViewModel } from '@/features/auth/hooks/models/useLoginViewModel';
import { AtmosphericBackground } from '@/features/auth/components/AtmosphericBackground';
import { LogoHalo } from './components/LogoHalo';
import { LoginPanel } from './components/LoginPanel';
import { MetaBar } from './components/MetaBar';

export function LoginScreen() {
  const { handleAppleLogin, handleGoogleLogin, goToLoginEmail, goToSignup } =
    useLoginViewModel();

  return (
    <View className="flex-1">
      <AtmosphericBackground />
      <View className="flex-1 items-center justify-center gap-10 px-5">
        <LogoHalo />
        <LoginPanel
          onAppleLogin={handleAppleLogin}
          onGoogleLogin={handleGoogleLogin}
          onEmailLogin={goToLoginEmail}
          onSignup={goToSignup}
        />
      </View>
      <MetaBar />
    </View>
  );
}
