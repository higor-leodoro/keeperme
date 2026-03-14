import { AntDesign } from "@expo/vector-icons";

import { MainButton } from "@/components";

type SignInWithGoogleProps = {
  authService: () => void;
};

export const SignInWithGoogle = ({ authService }: SignInWithGoogleProps) => {
  return (
    <MainButton
      text="Continuar com Google"
      variant="default"
      onPress={authService}
      icon={<AntDesign name="google" size={24} color="#737373" />}
    />
  );
};
