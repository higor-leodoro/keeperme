import { PresetConfig } from "react-native-animated-glow";

type NeonAnimationParams = {
  cornerRadius?: number;
  animationSpeed?: number;
  colors?: string[];
};

export const neonAnimation = ({
  cornerRadius = 40,
  animationSpeed = 1.5,
  colors = [
    "rgba(255, 255, 255, 0.3)",
    "rgba(200, 210, 220, 0.2)",
    "rgba(0, 0, 0, 0)",
  ],
}: NeonAnimationParams = {}): PresetConfig => ({
  metadata: {
    name: "silverGlow",
    textColor: "#FFFFFF",
    category: "Custom",
    tags: [],
  },
  states: [
    {
      name: "default",
      preset: {
        cornerRadius,
        backgroundColor: "transparent",
        animationSpeed,
        // borderSpeedMultiplier: 1,

        glowLayers: [
          {
            glowPlacement: "behind",
            colors,
            glowSize: 0.5,
            opacity: 0.5,
            speedMultiplier: 1,
            coverage: 1,
          },
          {
            glowPlacement: "behind",
            colors,
            glowSize: 0.5,
            opacity: 0.8,
            speedMultiplier: 1,
            coverage: 1,
          },
          {
            glowPlacement: "behind",
            colors,
            glowSize: 0.5,
            opacity: 0.9,
            speedMultiplier: 1,
            coverage: 1,
          },
        ],
      },
    },
  ],
});
