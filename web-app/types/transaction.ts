export type TransactionType = "INCOME" | "EXPENSE"

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  category: { id: string; name: string }
  description: string
  date: string
  groupId?: string | null
  group?: { id: string; name: string } | null
  user?: { id: string; name: string; email: string }
}

export type CreateTransactionDTO = {
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string
  groupId?: string | null
}
