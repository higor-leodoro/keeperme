import { api } from "./config"
import { Transaction, CreateTransactionDTO, TransactionCategory } from "@/types"

export const getTransactions = (groupId?: string): Promise<Transaction[]> =>
  api.get<Transaction[]>("/transactions", groupId ? { groupId } : undefined)

export const getTransactionsAllCategories = (
  params?: { startDate?: string; endDate?: string }
): Promise<TransactionCategory[]> =>
  api.get<TransactionCategory[]>(
    "/transactions/all-categories",
    params as Record<string, string> | undefined
  )

export const createTransaction = (dto: CreateTransactionDTO): Promise<Transaction> =>
  api.post<Transaction>("/transactions", dto)

export const updateTransaction = (
  id: string,
  data: Partial<CreateTransactionDTO>
): Promise<Transaction> => api.patch<Transaction>(`/transactions/${id}`, data)

export const deleteTransaction = (id: string): Promise<{ message: string }> =>
  api.delete<{ message: string }>(`/transactions/${id}`)
