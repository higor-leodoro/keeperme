import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getGroups } from "@/services/group.service"
import { Group } from "@/types"

export const useGetGroups = (): UseQueryResult<Group[]> => {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: getGroups,
  })
}
