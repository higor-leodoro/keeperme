import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createGroupInvite } from "@/services/group.service"
import { Invite } from "@/types"

type Options = {
  onSuccess?: (data: Invite) => void
  onError?: (error: Error) => void
}

export const useCreateGroupInvite = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<Invite, Error, { groupId: string; email: string }>({
    mutationFn: ({ groupId, email }) => createGroupInvite(groupId, email),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group-invites", variables.groupId] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
