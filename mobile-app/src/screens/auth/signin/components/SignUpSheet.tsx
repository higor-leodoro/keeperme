import AnimatedGlow from "react-native-animated-glow";

import { SignUpForm } from "./SignUpForm";

import { neonAnimation } from "@/constants";

interface SignUpSheetProps {
  onBack: () => void;
}

export const SignUpSheet = ({ onBack }: SignUpSheetProps) => {
  return (
    <AnimatedGlow preset={neonAnimation()}>
      <SignUpForm onBack={onBack} />
    </AnimatedGlow>
  );
};

