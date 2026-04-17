import { Text, View } from 'react-native';
import { AuthGlassPanel } from '@/features/auth/components/AuthGlassPanel';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { PrimaryButton } from '@/features/auth/components/PrimaryButton';
import { TextField } from '@/features/auth/components/TextField';
import { useForgotPasswordViewModel } from '@/features/auth/hooks/models/useForgotPasswordViewModel';

export function ForgotPasswordScreen() {
  const {
    email,
    setEmail,
    error,
    loading,
    canSubmit,
    submit,
    goBack,
  } = useForgotPasswordViewModel();

  return (
    <AuthScreenLayout onBack={goBack}>
      <AuthGlassPanel
        eyebrow="AUTH · 05 · RECUPERAR"
        title="Recuperar acesso"
      >
        <Text className="-mt-2 mb-5 font-display text-body-md text-text-soft">
          enviaremos um código de 6 dígitos para o email cadastrado.
        </Text>

        <View className="gap-4">
          <TextField
            label="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="go"
            onSubmitEditing={submit}
            autoFocus
          />

          <View className="mt-1">
            <PrimaryButton
              label="Enviar código"
              onPress={submit}
              loading={loading}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </AuthGlassPanel>
    </AuthScreenLayout>
  );
}
