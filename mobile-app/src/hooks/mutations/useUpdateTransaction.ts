import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

import { updateTransaction } from "@/services/transaction.service";
import { Transaction } from "@/types";

type UseUpdateTransactionOptions = {
  onSuccess?: (data: Transaction) => void;
  onError?: (error: Error) => void;
};

type UpdateTransactionParams = {
  id: string;
  transaction: Partial<Transaction>;
};

export const useUpdateTransaction = (
  options?: UseUpdateTransactionOptions
): UseMutationResult<Transaction, Error, UpdateTransactionParams> => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation<Transaction, Error, UpdateTransactionParams>({
    mutationFn: ({ id, transaction }) => updateTransaction(id, transaction),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsAllCategories"] });
      navigation.goBack();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

