import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateTransaction } from "@/services/transaction.service"
import { CreateTransactionDTO, Transaction } from "@/types"

type Options = {
  onSuccess?: (data: Transaction) => void
  onError?: (error: Error) => void
}

export const useUpdateTransaction = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<Transaction, Error, { id: string; data: Partial<CreateTransactionDTO> }>({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["balance"] })
      queryClient.invalidateQueries({ queryKey: ["all-categories"] })
      queryClient.invalidateQueries({ queryKey: ["group-transactions"] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
