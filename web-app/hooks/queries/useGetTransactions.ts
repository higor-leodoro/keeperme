import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getTransactions } from "@/services/transaction.service"
import { Transaction } from "@/types"

export const useGetTransactions = (
  params?: { groupId?: string; startDate?: string; endDate?: string }
): UseQueryResult<Transaction[]> => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  })
}
