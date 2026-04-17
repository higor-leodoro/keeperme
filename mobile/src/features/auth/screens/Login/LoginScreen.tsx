import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginViewModel } from '@/features/auth/hooks/models/useLoginViewModel';

export function LoginScreen() {
  const { handleEnter } = useLoginViewModel();

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 items-center justify-center px-5.5">
        <Text className="font-display-medium text-hero-md text-text-primary mb-10">
          Login
        </Text>
        <Pressable
          onPress={handleEnter}
          className="h-14 px-8 rounded-md bg-accent items-center justify-center active:opacity-60"
        >
          <Text className="font-display-medium text-body-md text-bg-base">
            Entrar
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
