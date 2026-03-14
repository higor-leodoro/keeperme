import { ScrollView, View } from "react-native";

import { TransactionTypeSelector } from "./components/TransactionTypeSelector";
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

export const NewTransaction = () => {
  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    description,
    setDescription,
    t,
    createTransaction,
    isPending,
    isFormInvalid,
  } = useViewModel();

  const isDisabled = isFormInvalid || isPending;

  return (
    <AppContainer>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6 pb-8">
          <View className="mt-6">
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
        </View>
      </ScrollView>
      <View className="pb-4">
        <MainButton
          text={t("newTransaction.save")}
          onPress={() => createTransaction()}
          variant={isDisabled ? "outline" : "default"}
          disabled={isDisabled}
        />
      </View>
    </AppContainer>
  );
};
