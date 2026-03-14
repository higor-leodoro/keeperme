import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";

import { MainButton } from "@/components";

type SignInWithAppleProps = {
  authService: (identityToken: string) => Promise<void>;
};

export const SignInWithApple = ({ authService }: SignInWithAppleProps) => {
  const handleSignInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await authService(credential.identityToken);
      } else {
        console.log("Apple Sign-In failed: identity token not available");
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        console.log("Apple Sign-In failed: identity token not available");
      }
    }
  };

  return (
    <MainButton
      text="Continuar com Apple"
      onPress={handleSignInWithApple}
      icon={<Ionicons name="logo-apple" size={24} color="#737373" />}
    />
  );
};
