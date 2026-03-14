import { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import {
  AppContainer,
  CustomText,
  Header,
  TransactionList,
} from "@/components";
import { useI18n } from "@/hooks";
import { useGetTransactions } from "@/hooks/queries";
import { TransactionTypeEnum } from "@/types";

type FilterType = "ALL" | TransactionTypeEnum;

export const TransactionsReport = () => {
  const { t } = useI18n();
  const { data: transactions = [], isLoading } = useGetTransactions();
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredTransactions = useMemo(() => {
    if (filter === "ALL") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "ALL", label: t("transactions.filters.all") },
    {
      key: TransactionTypeEnum.EXPENSE,
      label: t("transactions.filters.expenses"),
    },
    {
      key: TransactionTypeEnum.INCOME,
      label: t("transactions.filters.income"),
    },
  ];

  return (
    <AppContainer>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="gap-6 pb-8 px-4">
          <View className="flex-row gap-2">
            {filters.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                className={`flex-1 py-3 rounded-2xl border ${
                  filter === f.key
                    ? "bg-white/20 border-white/40"
                    : "bg-transparent border-white/20"
                }`}
              >
                <CustomText
                  className={`text-center text-sm ${
                    filter === f.key
                      ? "text-white font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {f.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <TransactionList
            transactions={filteredTransactions}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </AppContainer>
  );
};
