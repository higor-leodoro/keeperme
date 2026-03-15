import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createGroup } from "@/services/group.service"
import { CreateGroupDTO, Group } from "@/types"

type Options = {
  onSuccess?: (data: Group) => void
  onError?: (error: Error) => void
}

export const useCreateGroup = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<Group, Error, CreateGroupDTO>({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
