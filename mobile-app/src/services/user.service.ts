import { api } from "./config";

import { User } from "@/types";

type UpdateUserPayload = {
  name?: string;
  lastName?: string;
  photo?: string;
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<User> => {
  try {
    const { data } = await api.patch<User>(`/user/${userId}`, payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

