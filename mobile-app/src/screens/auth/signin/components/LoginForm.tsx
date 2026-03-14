import { useRef, useState } from "react";
import { TextInput, View } from "react-native";

import { CustomText, MainButton } from "@/components";

interface LoginFormProps {
  onBack: () => void;
  onSubmit?: (email: string, password: string) => void;
}

export const LoginForm = ({ onBack, onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(email, password);
    }
  };

  return (
    <View className="gap-4 justify-center px-5 h-full">
      <CustomText
        text="Entrar com Email"
        className="text-neutral-300 text-2xl font-semibold text-center mb-2"
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#a3a3a3"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        textContentType="emailAddress"
        submitBehavior="newline"
        onSubmitEditing={() => passwordRef.current?.focus()}
        className="bg-app-gray-medium p-4 rounded-2xl text-neutral-300 text-base border border-light"
      />

      <TextInput
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        placeholderTextColor="#a3a3a3"
        secureTextEntry
        returnKeyType="done"
        textContentType="password"
        onSubmitEditing={handleSubmit}
        className="bg-app-gray-medium p-4 rounded-2xl text-neutral-300 text-base border border-light"
      />

      <MainButton text="Entrar" variant="secondary" onPress={handleSubmit} />

      <MainButton text="← Voltar" variant="ghost" size="sm" onPress={onBack} />
    </View>
  );
};
