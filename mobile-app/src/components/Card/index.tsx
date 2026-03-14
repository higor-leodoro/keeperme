import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ColorValue, StyleSheet, View } from "react-native";

import { colors } from "@/constants";

type CardProps = {
  children: ReactNode;
  width?: number;
  height?: number;
  gradientColors?: [string, string];
  withBorder?: boolean;
  borderRadius?: number;
};

export const Card = ({
  children,
  width = 360,
  height = 200,
  gradientColors = [colors.surface.overlay, "rgba(255, 255, 255, 0.4)"],
  withBorder = true,
  borderRadius = 20,
}: CardProps) => {
  return (
    <View
      style={[
        styles.cardContainer,
        { width, height, borderRadius },
        !withBorder && styles.noBorder,
      ]}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={[styles.blurContainer, { borderRadius: borderRadius * 0.5 }]}
      >
        <LinearGradient
          colors={gradientColors as [ColorValue, ColorValue, ...ColorValue[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // marginRight: 8,
    overflow: "hidden",
    borderWidth: 8,
    borderColor: colors.surface.border,
  },
  noBorder: {
    borderWidth: 0,
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
});
