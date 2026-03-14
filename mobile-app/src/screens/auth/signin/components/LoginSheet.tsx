import { TouchableOpacity, View } from "react-native";
import AnimatedGlow from "react-native-animated-glow";
import Animated from "react-native-reanimated";

import { LoginForm } from "./LoginForm";
import { SignInWithApple } from "./SignInWithApple";
import { SignInWithGoogle } from "./SignInWithGoogle";

import { CustomText, MainButton } from "@/components";
import { neonAnimation } from "@/constants";
import { useFlipAnimation } from "@/hooks";
import { useAuthStore } from "@/stores";

interface LogginSheetProps {
  onSignUpPress?: () => void;
}

export const LogginSheet = ({ onSignUpPress }: LogginSheetProps) => {
  const { signInWithGoogle, signInWithApple } = useAuthStore();
  const {
    flip,
    frontAnimatedStyle,
    backAnimatedStyle,
    frontAnimatedProps,
    backAnimatedProps,
  } = useFlipAnimation();

  return (
    <AnimatedGlow preset={neonAnimation()}>
      <View className="h-80">
        {/* Front Card */}
        <Animated.View
          animatedProps={frontAnimatedProps}
          style={[frontAnimatedStyle]}
          className="absolute w-full h-full bg-neutral-900 rounded-[40px] gap-4 justify-center px-5"
        >
          <SignInWithApple authService={signInWithApple} />
          <SignInWithGoogle authService={signInWithGoogle} />
          <MainButton text="Entrar" variant="secondary" onPress={flip} />
          <TouchableOpacity activeOpacity={0.8} onPress={onSignUpPress}>
            <CustomText className="text-neutral-300 text-center text-base">
              Ainda não tem uma conta? clique aqui
            </CustomText>
          </TouchableOpacity>
        </Animated.View>

        {/* Back Card */}
        <Animated.View
          animatedProps={backAnimatedProps}
          style={[backAnimatedStyle]}
          className="absolute w-full h-full bg-neutral-900 rounded-[40px]"
        >
          <LoginForm onBack={flip} />
        </Animated.View>
      </View>
    </AnimatedGlow>
  );
};
