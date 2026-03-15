import { api } from "./config"
import { User } from "@/types"

export const getMe = (): Promise<User> =>
  api.post<User>("/auth/me")

export const updateUser = (
  id: string,
  payload: { name?: string; lastName?: string; photo?: string }
): Promise<User> => api.patch<User>(`/user/${id}`, payload)
