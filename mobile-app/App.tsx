import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

import { colors, loadFonts } from "@/constants";
import "@/i18n";
import Routes from "@/router";
import { useInternationalizationStore } from "@/stores";

import "./global.css";

export default function App() {
  const [isFontLoaded] = useFonts(loadFonts);
  const { initialize } = useInternationalizationStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isFontLoaded) return null;

  GoogleSignin.configure({
    iosClientId:
      "984547779397-87crouthd4i6pdevo4493vgrglsa4p4h.apps.googleusercontent.com",
  });

  const queryClient = new QueryClient();

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success,
          backgroundColor: colors.palette.gray.medium,
          borderLeftWidth: 6,
          borderRadius: 12,
          height: 70,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.palette.white,
          fontFamily: "Poppins_600SemiBold",
        }}
        text2Style={{
          fontSize: 14,
          color: colors.palette.gray.light,
          fontFamily: "Poppins_400Regular",
        }}
      />
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error,
          backgroundColor: colors.palette.gray.medium,
          borderLeftWidth: 6,
          borderRadius: 12,
          height: 70,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.palette.white,
          fontFamily: "Poppins_600SemiBold",
        }}
        text2Style={{
          fontSize: 14,
          color: colors.palette.gray.light,
          fontFamily: "Poppins_400Regular",
        }}
      />
    ),
    info: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.category.transport,
          backgroundColor: colors.palette.white,
          borderLeftWidth: 6,
          borderRadius: 12,
          height: 70,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.palette.white,
          fontFamily: "Poppins_600SemiBold",
        }}
        text2Style={{
          fontSize: 14,
          color: colors.palette.gray.light,
          fontFamily: "Poppins_400Regular",
        }}
      />
    ),
    warning: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.warning,
          backgroundColor: colors.palette.white,
          borderLeftWidth: 6,
          borderRadius: 12,
          height: 70,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.palette.white,
          fontFamily: "Poppins_600SemiBold",
        }}
        text2Style={{
          fontSize: 14,
          color: colors.palette.gray.light,
          fontFamily: "Poppins_400Regular",
        }}
      />
    ),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Routes />
            <Toast config={toastConfig} visibilityTime={3000} topOffset={80} />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
