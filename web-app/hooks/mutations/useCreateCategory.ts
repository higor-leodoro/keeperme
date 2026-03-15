import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createCategory } from "@/services/category.service"
import { Category } from "@/types"

type Options = {
  onSuccess?: (data: Category) => void
  onError?: (error: Error) => void
}

export const useCreateCategory = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<Category, Error, { name: string }>({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
