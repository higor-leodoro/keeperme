import { Pressable, View } from "react-native";

import { CustomText, Icon } from "@/components";
import { colors } from "@/constants";
import { useI18n } from "@/hooks";
import { TransactionTypeEnum } from "@/types";

type TransactionTypeSelectorProps = {
  selectedType: TransactionTypeEnum | null;
  onSelectType: (type: TransactionTypeEnum) => void;
};

export const TransactionTypeSelector = ({
  selectedType,
  onSelectType,
}: TransactionTypeSelectorProps) => {
  const { t } = useI18n();

  const types = [
    {
      type: TransactionTypeEnum.INCOME,
      icon: "arrow-up" as const,
      label: t("newTransaction.income"),
      color: colors.success,
    },
    {
      type: TransactionTypeEnum.EXPENSE,
      icon: "arrow-down" as const,
      label: t("newTransaction.expense"),
      color: colors.error,
    },
  ];

  return (
    <View className="flex-row gap-3">
      {types.map((item) => {
        const isSelected = selectedType === item.type;

        return (
          <Pressable
            key={item.type}
            onPress={() => onSelectType(item.type)}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flexDirection: "row",
                height: 80,
                borderRadius: 12,
                backgroundColor: colors.palette.gray.medium,
                borderWidth: isSelected ? 1.5 : 0,
                borderColor: isSelected ? item.color : "transparent",
              }}
              className="flex-1 items-center justify-center gap-2"
            >
              <Icon
                name={item.icon}
                color={item.color}
                strokeWidth={1.5}
                size={24}
              />

              <CustomText className="text-lg text-center">
                {item.label}
              </CustomText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
