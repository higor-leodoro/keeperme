import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getCategories } from "@/services/category.service"
import { Category } from "@/types"

export const useGetCategories = (): UseQueryResult<Category[]> => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  })
}
