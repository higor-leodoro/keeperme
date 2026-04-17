import { useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AuthGlassPanel } from '@/features/auth/components/AuthGlassPanel';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PrimaryButton } from '@/features/auth/components/PrimaryButton';
import { useResetPasswordViewModel } from '@/features/auth/hooks/models/useResetPasswordViewModel';

export function ResetPasswordScreen() {
  const confirmRef = useRef<TextInput>(null);
  const {
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
  } = useResetPasswordViewModel();

  return (
    <AuthScreenLayout>
      <AuthGlassPanel
        eyebrow="AUTH · 06 · NOVA SENHA"
        title="Definir nova senha"
      >
        <View className="gap-4">
          <PasswordField
            label="nova senha"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            textContentType="newPassword"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
          <PasswordField
            ref={confirmRef}
            label="confirmar senha"
            placeholder="••••••"
            value={confirm}
            onChangeText={setConfirm}
            error={errors.confirm}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          <View className="mt-1 gap-1.5">
            <Requirement ok={meetsLength} label="mínimo 6 caracteres" />
            <Requirement ok={matches} label="senhas coincidem" />
          </View>

          <View className="mt-2">
            <PrimaryButton
              label="Salvar"
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

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text
        className={`font-mono text-caption ${ok ? 'text-positive' : 'text-text-mute'} tracking-mono-wide`}
      >
        {ok ? '✓' : '·'}
      </Text>
      <Text
        className={`font-mono text-caption uppercase tracking-mono-wide ${ok ? 'text-text-secondary' : 'text-text-mute'}`}
      >
        {label}
      </Text>
    </View>
  );
}
