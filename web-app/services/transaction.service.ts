import { api } from "./config"
import { Transaction, CreateTransactionDTO, TransactionCategory } from "@/types"

export const getTransactions = (
  params?: { groupId?: string; startDate?: string; endDate?: string }
): Promise<Transaction[]> => {
  const query: Record<string, string> = {}
  if (params?.groupId) query.groupId = params.groupId
  if (params?.startDate) query.startDate = params.startDate
  if (params?.endDate) query.endDate = params.endDate
  return api.get<Transaction[]>("/transactions", Object.keys(query).length > 0 ? query : undefined)
}

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
