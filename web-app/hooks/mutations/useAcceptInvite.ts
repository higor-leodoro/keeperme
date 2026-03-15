import { useMutation, useQueryClient } from "@tanstack/react-query"

import { acceptInvite } from "@/services/invite.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useAcceptInvite = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] })
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
