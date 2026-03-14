import { Pressable, ScrollView, View } from "react-native";

import { Card, CustomText, Icon } from "@/components";
import { categoryConfig } from "@/constants";
import { useI18n } from "@/hooks";
import { Category } from "@/types";

type CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
};

export const CategoryPicker = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryPickerProps) => {
  const { t } = useI18n();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {categories.map((category, index) => {
          const config = categoryConfig[category.name];
          const isSelected = selectedCategoryId === category.id;

          return (
            <View
              key={index}
              style={{
                borderWidth: isSelected ? 1.5 : 0,
                borderColor: isSelected ? config.color : "transparent",
                borderRadius: 12,
              }}
            >
              <Pressable onPress={() => onSelectCategory(category.id)}>
                <Card
                  width={115}
                  height={90}
                  withBorder={false}
                  borderRadius={12}
                >
                  <View className="flex-1 items-center justify-center gap-1">
                    <Icon
                      name={config.icon}
                      color={config.color}
                      size={24}
                      withBackground={true}
                    />

                    <CustomText className="text-sm text-center">
                      {t(`category.${category.name}`)}
                    </CustomText>
                  </View>
                </Card>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
