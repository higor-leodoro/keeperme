import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { createTransaction } from "@/services/transaction.service";
import { CreateTransactionDTO, Transaction } from "@/types";

type UseCreateTransactionOptions = {
  onSuccess?: (data: Transaction) => void;
  onError?: (error: Error) => void;
};

export const useCreateTransaction = (
  options?: UseCreateTransactionOptions
): UseMutationResult<Transaction, Error, CreateTransactionDTO> => {
  return useMutation<Transaction, Error, CreateTransactionDTO>({
    mutationFn: (transaction: CreateTransactionDTO) =>
      createTransaction(transaction),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
