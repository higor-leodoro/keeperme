import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './auth.stack';
import { AppTabs } from './app.tabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={AppTabs} />
    </Stack.Navigator>
  );
}
