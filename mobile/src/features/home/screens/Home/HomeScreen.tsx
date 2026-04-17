import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 items-center justify-center">
        <Text className="font-display-medium text-hero-md text-text-primary">
          Home
        </Text>
      </View>
    </SafeAreaView>
  );
}
