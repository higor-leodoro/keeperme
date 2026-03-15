import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateCategory } from "@/services/category.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useUpdateCategory = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) => updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
