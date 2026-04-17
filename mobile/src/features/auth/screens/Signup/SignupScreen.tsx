import { useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AuthGlassPanel } from '@/features/auth/components/AuthGlassPanel';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PrimaryButton } from '@/features/auth/components/PrimaryButton';
import { TextField } from '@/features/auth/components/TextField';
import { useSignupViewModel } from '@/features/auth/hooks/models/useSignupViewModel';

export function SignupScreen() {
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const {
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
  } = useSignupViewModel();

  return (
    <AuthScreenLayout onBack={goBack}>
      <AuthGlassPanel eyebrow="AUTH · 03 · CADASTRO" title="Criar conta">
        <Text className="-mt-2 mb-4 font-mono text-caption uppercase text-text-secondary tracking-mono-wide">
          2 passos · 30 segundos
        </Text>

        <View className="gap-4">
          <TextField
            label="nome"
            placeholder="Higor"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />
          <TextField
            ref={lastNameRef}
            label="sobrenome"
            placeholder="Leodoro"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <TextField
            ref={emailRef}
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
            hint="mínimo 6 caracteres"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        </View>

        <Text className="mt-5 font-mono text-caption-xs uppercase text-text-ghost tracking-mono-wide">
          ao continuar, você aceita os termos e a política de privacidade
        </Text>

        <View className="mt-5">
          <PrimaryButton
            label="Continuar"
            onPress={submit}
            loading={loading}
            disabled={!canSubmit}
          />
        </View>
      </AuthGlassPanel>
    </AuthScreenLayout>
  );
}
