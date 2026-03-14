import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { useI18n, useRouteParams } from "@/hooks";
import { useCreateTransaction } from "@/hooks/mutations";
import { useGetCategories } from "@/hooks/queries";
import { useDatePickerStore } from "@/stores";
import { TransactionTypeEnum } from "@/types";

export default function useViewModel() {
  const params = useRouteParams<"NewTransaction">();
  const { data: categories } = useGetCategories();
  const { resetDatePicker, selectedDay } = useDatePickerStore();

  const { t } = useI18n();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isFromNavigation, setIsFromNavigation] = useState(false);
  const [transactionType, setTransactionType] =
    useState<TransactionTypeEnum | null>(
      params?.type as TransactionTypeEnum | null
    );
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

  console.log(selectedCategoryId);
  console.log(transactionType);
  console.log(amount);
  console.log(description);
  console.log(selectedDay);

  const { mutate: createTransaction, isPending } = useCreateTransaction({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("newTransaction.success"),
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("newTransaction.error"),
      });
    },
  });

  const handleCreateTransaction = () => {
    createTransaction({
      type: transactionType as TransactionTypeEnum,
      amount: amount,
      description: description,
      date: selectedDay,
      categoryId: selectedCategoryId!,
    });
  };

  const isFormInvalid = () => {
    if (!transactionType) return true;
    if (!amount || amount <= 0) return true;
    if (!description || description.trim() === "") return true;
    if (!selectedDay) return true;
    if (!selectedCategoryId) return true;

    return false;
  };

  useEffect(() => {
    if (params?.category && categories) {
      const categoryId = categories.find(
        (cat) => cat.name === params.category
      )?.id;
      if (categoryId) {
        setSelectedCategoryId(categoryId);
        setIsFromNavigation(true);
      }
    }
  }, [categories, params?.category]);

  useEffect(() => {
    return () => {
      setSelectedCategoryId(null);
      setAmount(0);
      setDescription("");
      resetDatePicker();
    };
  }, [resetDatePicker]);

  const sortedCategories = categories
    ? selectedCategoryId && isFromNavigation
      ? [
          ...categories.filter((cat) => cat.id === selectedCategoryId),
          ...categories.filter((cat) => cat.id !== selectedCategoryId),
        ]
      : categories
    : categories;

  return {
    categories: sortedCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    description,
    setDescription,
    t,
    createTransaction: handleCreateTransaction,
    isPending,
    isFormInvalid: isFormInvalid(),
  };
}
