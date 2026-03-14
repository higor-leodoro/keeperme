import { useEffect } from "react";
import { View } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { LoadingSpinner } from "@/components";
import { useAuthStore } from "@/stores";

export default function Routes() {
  const { isAuthenticated, loading, autoSignIn } = useAuthStore();

  useEffect(() => {
    autoSignIn();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <LoadingSpinner size={100} cornerRadius={100} />
      </View>
    );
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}
