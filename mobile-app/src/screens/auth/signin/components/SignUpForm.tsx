import { useRef, useState } from "react";
import { TextInput, View } from "react-native";

import { CustomText, MainButton } from "@/components";

interface SignUpFormProps {
  onBack: () => void;
  onSubmit?: (firstName: string, lastName: string, email: string) => void;
}

export const SignUpForm = ({ onBack, onSubmit }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(firstName, lastName, email);
    }
  };

  return (
    <View className="gap-4 justify-center px-5 h-[400px] bg-neutral-900 rounded-[40px]">
      <CustomText
        text="Criar Conta"
        className="text-neutral-300 text-2xl font-semibold text-center my-2"
      />

      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nome"
        placeholderTextColor="#a3a3a3"
        autoCapitalize="words"
        returnKeyType="next"
        textContentType="givenName"
        submitBehavior="newline"
        onSubmitEditing={() => lastNameRef.current?.focus()}
        className="bg-app-gray-medium p-4 rounded-2xl text-neutral-300 text-base border border-light"
      />

      <TextInput
        ref={lastNameRef}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Sobrenome"
        placeholderTextColor="#a3a3a3"
        autoCapitalize="words"
        returnKeyType="next"
        textContentType="familyName"
        submitBehavior="newline"
        onSubmitEditing={() => emailRef.current?.focus()}
        className="bg-app-gray-medium p-4 rounded-2xl text-neutral-300 text-base border border-light"
      />

      <TextInput
        ref={emailRef}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#a3a3a3"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="done"
        textContentType="emailAddress"
        submitBehavior="newline"
        onSubmitEditing={handleSubmit}
        className="bg-app-gray-medium p-4 rounded-2xl text-neutral-300 text-base border border-light"
      />

      <MainButton text="Criar Conta" onPress={handleSubmit} />
      <MainButton text="← Voltar" variant="ghost" size="sm" onPress={onBack} />
    </View>
  );
};
