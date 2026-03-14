import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AppContainerProps = {
  children: React.ReactNode;
};

export const AppContainer = ({ children }: AppContainerProps) => {
  return (
      <SafeAreaView className="flex-1 px-4 bg-[#111111]">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};
