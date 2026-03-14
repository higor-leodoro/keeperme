import { api } from "./config";

import { Balance } from "@/types";

export const getBalance = async (): Promise<Balance> => {
  try {
    const { data } = await api.get<Balance>("/balance");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
