import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Card, CustomText, Icon } from "@/components";
import { getCategoryConfig } from "@/constants/categoryConfig";
import { useAppNavigation, useCurrency, useI18n } from "@/hooks";
import { CategoryEnum, Transaction, TransactionTypeEnum } from "@/types";

type TransactionListProps = {
  transactions: Transaction[];
  isLoading?: boolean;
};

type GroupedTransactions = {
  category: CategoryEnum;
  transactions: Transaction[];
  total: number;
};

export const TransactionList = ({
  transactions,
  isLoading,
}: TransactionListProps) => {
  const { t } = useI18n();
  const { formatValue } = useCurrency();
  const navigation = useAppNavigation();

  // Agrupar transações por categoria
  const groupedTransactions = useMemo(() => {
    const groups = new Map<CategoryEnum, Transaction[]>();

    transactions.forEach((transaction) => {
      const category = transaction.category.name;
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(transaction);
    });

    // Converter para array e calcular totais
    const result: GroupedTransactions[] = Array.from(groups.entries()).map(
      ([category, categoryTransactions]) => {
        const total = categoryTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        return { category, transactions: categoryTransactions, total };
      }
    );

    // Ordenar por total (maior primeiro)
    return result.sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (isLoading) {
    return (
      <View className="items-center justify-center py-8">
        <CustomText className="text-gray-400">
          {t("transactions.loading")}
        </CustomText>
      </View>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <CustomText className="text-gray-400 text-center">
          {t("transactions.emptyState")}
        </CustomText>
      </View>
    );
  }

  const renderCategoryGroup = ({
    item: group,
  }: {
    item: GroupedTransactions;
  }) => {
    const categoryConfig = getCategoryConfig(group.category);

    return (
      <View className="gap-3">
        <View className="flex-row items-center justify-between px-2">
          <View className="flex-row items-center gap-3">
            <Icon
              name={categoryConfig.icon}
              size={20}
              color={categoryConfig.color}
              strokeWidth={2}
            />
            <CustomText className="text-lg font-semibold text-white">
              {t(`category.${group.category}`)}
            </CustomText>
          </View>
        </View>

        <FlatList
          data={group.transactions}
          renderItem={({ item: transaction }) => {
            const isIncome = transaction.type === TransactionTypeEnum.INCOME;
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            });

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("TransactionDetails", { transaction })
                }
              >
                <Card height={100}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Icon
                        name={categoryConfig.icon}
                        size={24}
                        color={categoryConfig.color}
                        withBackground
                        containerSize={48}
                      />
                      <View className="flex-1">
                        <CustomText className="text-white text-base font-medium">
                          {transaction.description}
                        </CustomText>
                        <CustomText className="text-gray-400 text-sm mt-1">
                          {formattedDate}
                        </CustomText>
                      </View>
                    </View>

                    <CustomText className="text-lg">
                      {isIncome ? "+" : "-"}
                      {formatValue(transaction.amount)}
                    </CustomText>
                  </View>
                </Card>
              </Pressable>
            );
          }}
          keyExtractor={(item) => item.id || ""}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={groupedTransactions}
      renderItem={renderCategoryGroup}
      keyExtractor={(item) => item.category}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View className="h-6" />}
    />
  );
};
