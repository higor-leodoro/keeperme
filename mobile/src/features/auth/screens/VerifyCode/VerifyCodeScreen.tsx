import { Text, View } from 'react-native';
import { AuthGlassPanel } from '@/features/auth/components/AuthGlassPanel';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { OTPInput } from '@/features/auth/components/OTPInput';
import { PrimaryButton } from '@/features/auth/components/PrimaryButton';
import { SecondaryLink } from '@/features/auth/components/SecondaryLink';
import { useVerifyCodeViewModel } from '@/features/auth/hooks/models/useVerifyCodeViewModel';
import { maskEmail } from '@/features/auth/utils/validators';

export function VerifyCodeScreen() {
  const {
    email,
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
  } = useVerifyCodeViewModel();

  return (
    <AuthScreenLayout onBack={goBack}>
      <AuthGlassPanel
        eyebrow="AUTH · 04 · VERIFICAR"
        title="Código enviado"
      >
        <Text className="-mt-2 mb-5 font-mono text-caption uppercase text-text-secondary tracking-mono-wide">
          6 dígitos · {maskEmail(email)}
        </Text>

        <View className="gap-4">
          <OTPInput
            value={code}
            onChange={handleChange}
            onComplete={handleComplete}
            error={Boolean(error)}
          />

          {error ? (
            <Text className="text-center font-mono text-caption-xs text-negative tracking-mono-wide">
              {error}
            </Text>
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <View
                className={`h-1.5 w-1.5 rounded-full ${canResend ? 'bg-positive' : 'bg-text-mute'}`}
              />
              <Text
                className="font-mono text-mono-lg text-text-hint"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {canResend ? 'pronto para reenviar' : `reenvio em ${timerLabel}`}
              </Text>
            </View>
          )}

          <View className="mt-1">
            <PrimaryButton
              label="Verificar"
              onPress={submit}
              loading={loading}
              disabled={code.length !== 6 || loading}
            />
          </View>

          <View className="mt-1">
            <SecondaryLink
              label={canResend ? 'reenviar código' : 'aguarde para reenviar'}
              onPress={resend}
              disabled={!canResend}
              align="center"
              tone="mono"
            />
          </View>
        </View>
      </AuthGlassPanel>
    </AuthScreenLayout>
  );
}
