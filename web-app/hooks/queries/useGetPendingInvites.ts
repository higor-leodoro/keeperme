import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getPendingInvites } from "@/services/invite.service"
import { Invite } from "@/types"

export const useGetPendingInvites = (): UseQueryResult<Invite[]> => {
  return useQuery<Invite[]>({
    queryKey: ["pending-invites"],
    queryFn: getPendingInvites,
  })
}
