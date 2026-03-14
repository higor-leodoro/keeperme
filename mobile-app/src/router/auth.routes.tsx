import { createStackNavigator } from "@react-navigation/stack";

import { RoutesParamsList } from "../types/routes";

import { SignIn } from "@/screens/auth";

export default function AuthRoutes() {
  const Stack = createStackNavigator<RoutesParamsList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
}
