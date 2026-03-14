import { api } from "./config";

import { Category } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};
