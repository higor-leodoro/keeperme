import { useState } from "react";
import { Image, Pressable, View } from "react-native";

import { CustomText } from "../CustomText";

import { useAppNavigation } from "@/hooks";

type AvatarProps = {
  photo?: string | null;
  name: string;
  size?: number;
};

export const Avatar = ({ photo, name, size = 80 }: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const { navigate } = useAppNavigation();
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const showFallback = !photo || imageError;

  return (
    <Pressable onPress={() => navigate("Profile")}>
      <View
        className="rounded-full bg-white justify-center items-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        {showFallback ? (
          <CustomText>{getInitial(name)}</CustomText>
        ) : (
          <Image
            source={{ uri: photo }}
            style={{
              width: size,
              height: size,
            }}
            onError={() => setImageError(true)}
          />
        )}
      </View>
    </Pressable>
  );
};
