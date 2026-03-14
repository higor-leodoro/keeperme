import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/services/transaction.service";
import { Transaction } from "@/types";

export const useGetTransactions = (): UseQueryResult<Transaction[]> => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });
};
