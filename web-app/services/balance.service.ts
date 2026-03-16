import { api } from "./config"
import { Balance } from "@/types"

export const getBalance = (
  params?: { groupId?: string; startDate?: string; endDate?: string }
): Promise<Balance> => {
  const query: Record<string, string> = {}
  if (params?.groupId) query.groupId = params.groupId
  if (params?.startDate) query.startDate = params.startDate
  if (params?.endDate) query.endDate = params.endDate
  return api.get<Balance>("/balance", Object.keys(query).length > 0 ? query : undefined)
}
