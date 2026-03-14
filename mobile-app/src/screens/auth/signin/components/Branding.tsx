import { Image } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import logo from "@/assets/logo.png";

export const Branding = () => {
  return (
    <Animated.View className="items-center justify-center" entering={FadeInUp}>
      <Image source={logo} className="w-96 h-96 " resizeMode="contain" />
    </Animated.View>
  );
};
