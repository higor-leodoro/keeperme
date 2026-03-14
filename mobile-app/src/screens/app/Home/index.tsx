import { ScrollView, View } from "react-native";

import useViewModel from "./useViewModel";

import {
  AppContainer,
  Avatar,
  BalanceCards,
  CategoryCards,
  CustomText,
  QuickActions,
} from "@/components";
import { useI18n } from "@/hooks";

export const Home = () => {
  const { user, categorySummary, balance } = useViewModel();
  const { t } = useI18n();

  return (
    <AppContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="ml-3 mb-4">
          <View className="flex-row items-center justify-between gap-2">
            <CustomText className="text-2xl">
              {t("home.greeting", { name: user.name })}
            </CustomText>
            <Avatar photo={user.photo} name={user.name} size={50} />
          </View>
          <CustomText>{t("home.welcomeBack")}</CustomText>
        </View>

        <BalanceCards balance={balance} />

        <View className="my-4">
          <CustomText className="text-xl ml-3 mb-2">
            {t("home.quickActions")}
          </CustomText>
          <QuickActions />
        </View>

        <View>
          <CustomText className="text-xl ml-3 mb-2">
            {t("home.expensesSummary")}
          </CustomText>
          <CategoryCards categorySummary={categorySummary} />
        </View>
        {/* <RadialChart data={categorySummary} /> */}
      </ScrollView>
    </AppContainer>
  );
};
