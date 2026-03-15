import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteGroupInvite } from "@/services/group.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useDeleteGroupInvite = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { groupId: string; inviteId: string }>({
    mutationFn: ({ groupId, inviteId }) => deleteGroupInvite(groupId, inviteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group-invites", variables.groupId] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
