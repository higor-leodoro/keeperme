import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BottomTabBar } from "@/components";
import {
  Home,
  NewTransaction,
  Profile,
  TransactionDetails,
  TransactionsReport,
} from "@/screens/app";
import { RoutesParamsList } from "@/types/routes";

const Tab = createBottomTabNavigator<RoutesParamsList>();
const Stack = createNativeStackNavigator<RoutesParamsList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="TransactionsReport" component={TransactionsReport} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="NewTransaction" component={NewTransaction} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
    </Stack.Navigator>
  );
}
