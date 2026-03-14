import { Pressable, ScrollView, View } from "react-native";

import { AnimatedView, Card, CustomText, Icon } from "@/components";
import { categoryConfig, colors } from "@/constants";
import { useAppNavigation, useCurrency, useI18n } from "@/hooks";
import { CategorySummary, TransactionTypeEnum } from "@/types";

type CategoryCardsProps = {
  categorySummary: CategorySummary[];
};

export const CategoryCards = ({ categorySummary }: CategoryCardsProps) => {
  const { t } = useI18n();
  const { formatValue } = useCurrency();

  const { navigate } = useAppNavigation();
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {categorySummary.map((item, index) => (
          <AnimatedView
            animation="fadeInRight"
            key={index}
            delay={index * 200}
            duration={700}
          >
            <Card width={230} height={120}>
              <Pressable
                onPress={() =>
                  navigate("NewTransaction", {
                    type: TransactionTypeEnum.EXPENSE,
                    category: item.category,
                  })
                }
                className="absolute top-3 right-3 p-2 z-10"
              >
                <Icon name="plus" color={colors.palette.white} size={24} />
              </Pressable>
              <View className="flex-1 flex-row items-center">
                <Icon
                  name={item.icon}
                  color={categoryConfig[item.category].color}
                  withBackground={true}
                  size={32}
                />
                <View className="ml-3 flex-1">
                  <CustomText className="mb-1 text-sm text-white">
                    {t(`category.${item.category}`)}
                  </CustomText>
                  <CustomText className="text-xl text-white">
                    {formatValue(item.value)}
                  </CustomText>
                </View>
              </View>
            </Card>
          </AnimatedView>
        ))}
      </ScrollView>
    </View>
  );
};
