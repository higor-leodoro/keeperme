import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateGroup } from "@/services/group.service"
import { CreateGroupDTO, Group } from "@/types"

type Options = {
  onSuccess?: (data: Group) => void
  onError?: (error: Error) => void
}

export const useUpdateGroup = (options?: Options) => {
  const queryClient = useQueryClient()

  return useMutation<Group, Error, { id: string; data: Partial<CreateGroupDTO> }>({
    mutationFn: ({ id, data }) => updateGroup(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      queryClient.invalidateQueries({ queryKey: ["group", data.id] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
