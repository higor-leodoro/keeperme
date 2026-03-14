import { Pressable, View } from "react-native";

import { CustomText } from "../CustomText";
import { Icon } from "../Icon";

import { colors } from "@/constants";
import { useAppNavigation, useDisplayScreenName, useI18n } from "@/hooks";

export const Header = () => {
  const { goBack } = useAppNavigation();
  const screenName = useDisplayScreenName();
  const { t } = useI18n();
  return (
    <View className="flex-row items-center py-4">
      <Pressable onPress={goBack} className="absolute left-4 z-10">
        <Icon
          name="arrow-left"
          size={24}
          color={colors.palette.white}
          strokeWidth={2}
        />
      </Pressable>
      <CustomText className="text-center flex-1 font-medium">
        {t(`screens.${screenName}.title`)}
      </CustomText>
    </View>
  );
};
