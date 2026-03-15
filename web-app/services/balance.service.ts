import { api } from "./config"
import { Balance } from "@/types"

export const getBalance = (groupId?: string): Promise<Balance> =>
  api.get<Balance>("/balance", groupId ? { groupId } : undefined)
