import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { getCategoryConfig } from "@/constants/categoryConfig";
import { getTransactionsAllCategories } from "@/services/transaction.service";
import { CategoryEnum, CategorySummary } from "@/types";

type UseGetTransactionAllCategoriesParams = {
  type?: string;
  groupId?: string;
  startDate?: string;
  endDate?: string;
};

export const useGetTransactionAllCategories = (
  params?: UseGetTransactionAllCategoriesParams
): UseQueryResult<CategorySummary[]> => {
  return useQuery<CategorySummary[]>({
    queryKey: ["all-categories", params],
    queryFn: async () => {
      const data = await getTransactionsAllCategories(params);

      // Criar um mapa para busca rápida por categoryName
      const categoryMap = new Map(
        data.map((cat) => [cat.categoryName, cat.total])
      );

      // Iterar sobre TODAS as categorias do enum e popular com dados da API
      return Object.values(CategoryEnum).map((category) => {
        const config = getCategoryConfig(category);

        return {
          category,
          value: categoryMap.get(category) || 0, // 0 se não tiver transações
          icon: config.icon,
        };
      });
    },
  });
};
