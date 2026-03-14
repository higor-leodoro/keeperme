import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { TransactionTypeSelector } from "../NewTrasaction/components/TransactionTypeSelector";

import useViewModel from "./useViewModel";

import {
  AppContainer,
  CategoryPicker,
  CustomText,
  DateSelector,
  Header,
  InputMask,
  MainButton,
} from "@/components";

export const TransactionDetails = () => {
  const {
    transaction,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    description,
    setDescription,
    currencyMask,
    currencyPlaceholder,
    t,
    updateTransaction,
    isPending,
    isFormInvalid,
  } = useViewModel();

  const isDisabled = isFormInvalid || isPending;

  if (!transaction) {
    return (
      <AppContainer>
        <Header />
        <View className="flex-1 items-center justify-center">
          <CustomText className="text-white text-lg">
            {t("transactionDetails.notFound")}
          </CustomText>
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="gap-6 pb-8"
        >
          <View className="mt-6">
            <CustomText className="text-2xl text-white font-semibold mb-4">
              {t("transactionDetails.title")}
            </CustomText>
            <TransactionTypeSelector
              selectedType={transactionType}
              onSelectType={setTransactionType}
            />
          </View>

          <InputMask
            label={t("newTransaction.amount")}
            isCurrency
            currencyValue={amount}
            onCurrencyChange={setAmount}
            value=""
            onChangeText={() => {}}
          />

          <InputMask
            label={t("newTransaction.description")}
            value={description}
            onChangeText={(masked) => setDescription(masked)}
            placeholder={t("newTransaction.description")}
          />

          <View>
            <CustomText className="text-lg mb-2 text-white">
              {t("newTransaction.date")}
            </CustomText>
            <DateSelector />
          </View>

          {categories && categories.length > 0 && (
            <View>
              <CustomText className="text-lg mb-2 text-white">
                {t("newTransaction.category")}
              </CustomText>
              <CategoryPicker
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </View>
          )}

          {transaction.user && (
            <View className="p-4 rounded-xl bg-white/5 border border-white/10">
              <CustomText className="text-white text-sm font-semibold mb-2">
                {t("transactionDetails.userInfo")}
              </CustomText>
              <CustomText className="text-gray-400 text-sm">
                {transaction.user.name}
              </CustomText>
              <CustomText className="text-gray-400 text-sm">
                {transaction.user.email}
              </CustomText>
            </View>
          )}
        </Animated.View>
      </ScrollView>
      <View className="pb-4">
        <MainButton
          text={t("transactionDetails.save")}
          onPress={() => updateTransaction()}
          variant={isDisabled ? "outline" : "default"}
          disabled={isDisabled}
        />
      </View>
    </AppContainer>
  );
};

