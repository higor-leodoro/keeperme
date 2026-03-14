import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { CustomText, Icon, IconName } from "@/components";
import { colors } from "@/constants";
import { useI18n } from "@/hooks";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = colors.palette.gray.medium;
const SECONDARY_COLOR = colors.palette.white;

type TabConfig = {
  name: string;
  icon: IconName;
  label: string;
};

export const BottomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { t } = useI18n();

  const tabs: TabConfig[] = [
    {
      name: "Home",
      icon: "home",
      label: t("tabs.home"),
    },
    {
      name: "TransactionsReport",
      icon: "dollar-sign",
      label: t("tabs.transactions"),
    },
    {
      name: "Profile",
      icon: "user",
      label: t("tabs.profile"),
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = state.index === index;
        const route = state.routes[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            entering={FadeIn.duration(1000)}
            exiting={FadeOut.duration(1000)}
            key={tab.name}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isActive ? SECONDARY_COLOR : "transparent",
              },
            ]}
          >
            <Icon
              name={tab.icon}
              size={18}
              color={isActive ? PRIMARY_COLOR : SECONDARY_COLOR}
              strokeWidth={2}
            />
            {isActive && (
              <Animated.View
              // entering={FadeIn.duration(500)}
              // exiting={FadeOut.duration(500)}
              >
                <CustomText className="text-app-black text-sm font-medium">
                  {tab.label}
                </CustomText>
              </Animated.View>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    width: "50%",
    alignSelf: "center",
    bottom: 40,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 12,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
    gap: 8,
  },
});
