import { useMutation, useQueryClient } from "@tanstack/react-query"

import { removeGroupMember } from "@/services/group.service"

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useRemoveGroupMember = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { groupId: string; userId: string }>({
    mutationFn: ({ groupId, userId }) => removeGroupMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
