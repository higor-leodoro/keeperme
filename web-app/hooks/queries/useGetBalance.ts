import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getBalance } from "@/services/balance.service"
import { Balance } from "@/types"

export const useGetBalance = (groupId?: string): UseQueryResult<Balance> => {
  return useQuery<Balance>({
    queryKey: ["balance", groupId],
    queryFn: () => getBalance(groupId),
  })
}
