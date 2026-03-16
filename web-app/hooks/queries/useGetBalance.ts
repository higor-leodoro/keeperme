import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getBalance } from "@/services/balance.service"
import { Balance } from "@/types"

export const useGetBalance = (
  params?: { groupId?: string; startDate?: string; endDate?: string }
): UseQueryResult<Balance> => {
  return useQuery<Balance>({
    queryKey: ["balance", params],
    queryFn: () => getBalance(params),
  })
}
