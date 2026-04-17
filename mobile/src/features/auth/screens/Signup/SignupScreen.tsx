import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SignupScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 items-center justify-center px-5.5">
        <Text className="font-display-medium text-hero-sm text-text-primary">
          Signup flow coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
