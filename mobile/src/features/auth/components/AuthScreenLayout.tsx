import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AtmosphericBackground } from './AtmosphericBackground';
import { BackButton } from './BackButton';

type Props = {
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
};

export function AuthScreenLayout({ children, onBack, backLabel }: Props) {
  return (
    <View className="flex-1 bg-bg-base">
      <AtmosphericBackground />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {onBack ? (
              <View className="mb-8">
                <BackButton label={backLabel} onPress={onBack} />
              </View>
            ) : (
              <View className="h-6" />
            )}
            <View className="flex-1 justify-center">{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
