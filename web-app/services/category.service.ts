import { api } from "./config"
import { Category } from "@/types"

export const getCategories = (): Promise<Category[]> =>
  api.get<Category[]>("/categories")

export const createCategory = (data: { name: string }): Promise<Category> =>
  api.post<Category>("/categories", data)

export const updateCategory = (
  id: string,
  data: { name: string }
): Promise<{ message: string }> =>
  api.patch<{ message: string }>(`/categories/${id}`, data)

export const deleteCategory = (id: string): Promise<{ message: string }> =>
  api.delete<{ message: string }>(`/categories/${id}`)
