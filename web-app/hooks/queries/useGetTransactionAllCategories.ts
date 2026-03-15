import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getTransactionsAllCategories } from "@/services/transaction.service"
import { TransactionCategory } from "@/types"

export const useGetTransactionAllCategories = (
  params?: { startDate?: string; endDate?: string }
): UseQueryResult<TransactionCategory[]> => {
  return useQuery<TransactionCategory[]>({
    queryKey: ["all-categories", params],
    queryFn: () => getTransactionsAllCategories(params),
  })
}
