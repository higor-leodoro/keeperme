import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getGroupInvites } from "@/services/group.service"
import { Invite } from "@/types"

export const useGetGroupInvites = (groupId: string): UseQueryResult<Invite[]> => {
  return useQuery<Invite[]>({
    queryKey: ["group-invites", groupId],
    queryFn: () => getGroupInvites(groupId),
    enabled: !!groupId,
  })
}
