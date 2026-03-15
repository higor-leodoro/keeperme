import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateUser } from "@/services/user.service"
import { User } from "@/types"

type Options = {
  onSuccess?: (data: User) => void
  onError?: (error: Error) => void
}

export const useUpdateUser = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<
    User,
    Error,
    { id: string; payload: { name?: string; lastName?: string; photo?: string } }
  >({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
