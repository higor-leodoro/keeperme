import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteTransaction } from "@/services/transaction.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteTransaction = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["balance"] })
      queryClient.invalidateQueries({ queryKey: ["all-categories"] })
      queryClient.invalidateQueries({ queryKey: ["group-transactions"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
