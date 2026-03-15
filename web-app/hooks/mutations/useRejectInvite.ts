import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rejectInvite } from "@/services/invite.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useRejectInvite = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: rejectInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
