import { useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AuthGlassPanel } from '@/features/auth/components/AuthGlassPanel';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PrimaryButton } from '@/features/auth/components/PrimaryButton';
import { SecondaryLink } from '@/features/auth/components/SecondaryLink';
import { TextField } from '@/features/auth/components/TextField';
import { useLoginEmailViewModel } from '@/features/auth/hooks/models/useLoginEmailViewModel';

export function LoginEmailScreen() {
  const passwordRef = useRef<TextInput>(null);
  const {
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
  } = useLoginEmailViewModel();

  return (
    <AuthScreenLayout onBack={goBack}>
      <AuthGlassPanel eyebrow="AUTH · 02 · EMAIL" title="Entrar com email">
        <View className="gap-4">
          <TextField
            label="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <PasswordField
            ref={passwordRef}
            label="senha"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <View className="-mt-1 self-end">
            <SecondaryLink
              label="esqueci a senha"
              onPress={goToForgotPassword}
              align="right"
              tone="mono"
            />
          </View>
          <View className="mt-1">
            <PrimaryButton
              label="Continuar"
              onPress={submit}
              loading={loading}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </AuthGlassPanel>

      <View className="mt-6 flex-row items-center justify-center gap-1.5">
        <Text className="font-mono text-caption-xs uppercase text-text-ghost tracking-mono-wide">
          não tem conta?
        </Text>
        <SecondaryLink label="criar conta" onPress={goToSignup} align="center" />
      </View>
    </AuthScreenLayout>
  );
}
