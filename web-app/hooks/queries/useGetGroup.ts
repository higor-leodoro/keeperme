import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getGroup } from "@/services/group.service"
import { Group } from "@/types"

export const useGetGroup = (id: string): UseQueryResult<Group> => {
  return useQuery<Group>({
    queryKey: ["group", id],
    queryFn: () => getGroup(id),
    enabled: !!id,
  })
}
