import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { getMe } from "@/services/user.service"
import { User } from "@/types"

export const useGetMe = (): UseQueryResult<User> => {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 30,
  })
}
