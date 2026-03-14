import { ScrollView, View } from "react-native";

import { colors } from "../../constants";
import { AnimatedView } from "../AnimatedView";
import { Card } from "../Card";
import { CustomText } from "../CustomText";
import { Icon, IconName } from "../Icon";

import { useCurrency, useI18n } from "@/hooks";
import { Balance } from "@/types";

type BalanceCardsProps = {
  balance?: Balance;
};

export const BalanceCards = ({ balance }: BalanceCardsProps) => {
  const { t } = useI18n();
  const { formatValue } = useCurrency();

  const balanceCards = [
    {
      title: t("balanceCards.balance"),
      value: formatValue(balance?.totalBalance || 0),
      icon: "wallet",
      color: colors.warning,
      backgroundColor: colors.palette.black,
      borderColor: colors.palette.gray.medium,
    },
    {
      title: t("balanceCards.income"),
      value: formatValue(balance?.totalIncome || 0),
      icon: "trending-up",
      color: colors.success,
      backgroundColor: colors.palette.black,
      borderColor: colors.palette.gray.medium,
    },
    {
      title: t("balanceCards.expenses"),
      value: formatValue(balance?.totalExpense || 0),
      icon: "trending-down",
      color: colors.error,
      backgroundColor: colors.palette.black,
      borderColor: colors.palette.gray.medium,
    },
  ];

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {balanceCards.map((card, index) => (
          <AnimatedView
            animation="fadeInRight"
            key={card.title}
            delay={index * 200}
            duration={700}
          >
            <Card width={300} height={150}>
              <View className="flex-1 flex-row items-center">
                <Icon
                  name={card.icon as IconName}
                  color={card.color}
                  withBackground={true}
                  size={32}
                />
                <View className="ml-4 flex-1">
                  <CustomText className="text-lg">{card.title}</CustomText>
                  <CustomText className="text-2xl">{card.value}</CustomText>
                </View>
              </View>
            </Card>
          </AnimatedView>
        ))}
      </ScrollView>
    </View>
  );
};
