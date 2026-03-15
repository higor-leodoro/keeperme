import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteCategory } from "@/services/category.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteCategory = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
