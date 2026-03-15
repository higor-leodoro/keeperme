import { api } from "./config"
import { Group, CreateGroupDTO, Transaction, Invite } from "@/types"

export const getGroups = (): Promise<Group[]> =>
  api.get<Group[]>("/groups")

export const getGroup = (id: string): Promise<Group> =>
  api.get<Group>(`/groups/${id}`)

export const createGroup = (dto: CreateGroupDTO): Promise<Group> =>
  api.post<Group>("/groups", dto)

export const updateGroup = (
  id: string,
  dto: Partial<CreateGroupDTO>
): Promise<Group> => api.patch<Group>(`/groups/${id}`, dto)

export const deleteGroup = (id: string): Promise<{ message: string }> =>
  api.delete<{ message: string }>(`/groups/${id}`)

export const getGroupTransactions = (groupId: string): Promise<Transaction[]> =>
  api.get<Transaction[]>(`/groups/${groupId}/transactions`)

export const createGroupInvite = (
  groupId: string,
  email: string
): Promise<Invite> => api.post<Invite>(`/groups/${groupId}/invites`, { email })

export const getGroupInvites = (groupId: string): Promise<Invite[]> =>
  api.get<Invite[]>(`/groups/${groupId}/invites`)

export const deleteGroupInvite = (
  groupId: string,
  inviteId: string
): Promise<{ message: string }> =>
  api.delete<{ message: string }>(`/groups/${groupId}/invites/${inviteId}`)

export const removeGroupMember = (
  groupId: string,
  userId: string
): Promise<{ message: string }> =>
  api.delete<{ message: string }>(`/groups/${groupId}/members/${userId}`)
