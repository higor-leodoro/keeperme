import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/features/home';
import { ProfileScreen } from '@/features/profile';
import type { AppTabsParamList } from './types';

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1114',
          borderTopColor: 'rgba(245, 240, 232, 0.08)',
        },
        tabBarActiveTintColor: '#F5F0E8',
        tabBarInactiveTintColor: 'rgba(245, 240, 232, 0.55)',
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
