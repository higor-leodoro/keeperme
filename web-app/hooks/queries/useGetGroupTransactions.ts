import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getGroupTransactions } from "@/services/group.service"
import { Transaction } from "@/types"

export const useGetGroupTransactions = (groupId: string): UseQueryResult<Transaction[]> => {
  return useQuery<Transaction[]>({
    queryKey: ["group-transactions", groupId],
    queryFn: () => getGroupTransactions(groupId),
    enabled: !!groupId,
  })
}
