import Animated, {
  FadeInUp,
  SlideInDown,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Branding, LogginSheet, SignUpSheet } from "./components";

import { useFlipAnimation } from "@/hooks";

export const SignIn = () => {
  const keyboard = useAnimatedKeyboard();
  const {
    flip: handleSignUpFlip,
    frontAnimatedStyle: frontPageStyle,
    backAnimatedStyle: backPageStyle,
    frontAnimatedProps: frontPageProps,
    backAnimatedProps: backPageProps,
  } = useFlipAnimation({ perspective: 2000 });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(-keyboard.height.value, {
            damping: 20,
            stiffness: 150,
            mass: 0.5,
          }),
        },
      ],
    };
  });

  return (
    <SafeAreaView className="bg-app-black flex-1">
      {/* Front Page - Login */}
      <Animated.View
        animatedProps={frontPageProps}
        style={[frontPageStyle]}
        className="absolute w-full h-full"
      >
        <Animated.View
          entering={FadeInUp.duration(1000)}
          className="w-full flex-grow justify-center items-center"
        >
          <Branding />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.duration(1500)}
          style={[animatedSheetStyle]}
          className="w-full flex-1 gap-4 justify-end px-2"
        >
          <LogginSheet onSignUpPress={handleSignUpFlip} />
        </Animated.View>
      </Animated.View>

      {/* Back Page - Sign Up */}
      <Animated.View
        animatedProps={backPageProps}
        style={[backPageStyle]}
        className="absolute w-full h-full"
      >
        <Animated.View className="w-full flex-grow justify-center items-center">
          <Branding />
        </Animated.View>
        <Animated.View
          style={[animatedSheetStyle]}
          className="w-full flex-1 gap-4 justify-end px-2"
        >
          <SignUpSheet onBack={handleSignUpFlip} />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};
