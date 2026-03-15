import { api } from "./config"
import { Invite } from "@/types"

export const getPendingInvites = (): Promise<Invite[]> =>
  api.get<Invite[]>("/invites/pending")

export const acceptInvite = (token: string): Promise<{ message: string }> =>
  api.post<{ message: string }>(`/invites/${token}/accept`)

export const rejectInvite = (token: string): Promise<{ message: string }> =>
  api.post<{ message: string }>(`/invites/${token}/reject`)
