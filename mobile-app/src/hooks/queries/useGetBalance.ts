import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { getBalance } from "@/services/balance.service";
import { Balance } from "@/types";

export const useGetBalance = (): UseQueryResult<Balance> => {
  return useQuery<Balance>({
    queryKey: ["balance"],
    queryFn: getBalance,
  });
};
