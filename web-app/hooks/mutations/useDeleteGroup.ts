import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteGroup } from "@/services/group.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteGroup = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
