import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { useI18n, useRouteParams } from "@/hooks";
import { useUpdateTransaction } from "@/hooks/mutations";
import { useGetCategories } from "@/hooks/queries";
import { useDatePickerStore } from "@/stores";
import { TransactionTypeEnum } from "@/types";

export default function useViewModel() {
  const params = useRouteParams<"TransactionDetails">();
  const transaction = params?.transaction;
  const { data: categories } = useGetCategories();
  const { setDatePicker, selectedDay } = useDatePickerStore();

  const { t } = useI18n();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    transaction?.categoryId || null
  );
  const [transactionType, setTransactionType] =
    useState<TransactionTypeEnum | null>(transaction?.type || null);
  const [amount, setAmount] = useState<number>(transaction?.amount || 0);
  const [description, setDescription] = useState(
    transaction?.description || ""
  );

  const { mutate: updateTransaction, isPending } = useUpdateTransaction({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("transactionDetails.updateSuccess"),
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("transactionDetails.updateError"),
      });
    },
  });

  const handleUpdateTransaction = () => {
    if (!transaction?.id) return;

    updateTransaction({
      id: transaction.id,
      transaction: {
        type: transactionType as TransactionTypeEnum,
        amount: amount,
        description: description,
        date: selectedDay,
        categoryId: selectedCategoryId!,
      },
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

  // Inicializar data quando a transação for carregada
  useEffect(() => {
    if (transaction?.date) {
      setDatePicker({ selectedDay: transaction.date });
    }
  }, [transaction, setDatePicker]);

  return {
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
    t,
    updateTransaction: handleUpdateTransaction,
    isPending,
    isFormInvalid: isFormInvalid(),
  };
}
