import { Pressable, ScrollView, View } from "react-native";

import { TransactionTypeEnum } from "../../types/transaction";

import { Card, CustomText, Icon, IconName } from "@/components";
import { colors } from "@/constants";
import { useAppNavigation, useI18n } from "@/hooks";

export const QuickActions = () => {
  const { navigate } = useAppNavigation();
  const { t } = useI18n();
  const quickActions = [
    {
      icon: "arrow-up",
      label: t("quickActions.newIncome"),
      onPress: () => {
        navigate("NewTransaction", { type: TransactionTypeEnum.INCOME });
      },
    },
    {
      icon: "arrow-down",
      label: t("quickActions.newExpense"),
      onPress: () => {
        navigate("NewTransaction", { type: TransactionTypeEnum.EXPENSE });
      },
    },
    {
      icon: "scroll-text",
      label: t("quickActions.extract"),
      onPress: () => navigate("TransactionsReport")
    },
  ];

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {quickActions.map((action, index) => (
          <Card
            key={index}
            width={122}
            height={100}
            withBorder={false}
            borderRadius={12}
          >
            <Pressable
              className="flex-1  items-center justify-center gap-1"
              onPress={() => action.onPress()}
            >
              <Icon
                name={action.icon as IconName}
                color={colors.palette.white}
                size={24}
                withBackground={true}
              />

              <CustomText className="text-sm text-center">
                {action.label}
              </CustomText>
            </Pressable>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};
