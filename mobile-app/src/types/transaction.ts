import { CategoryEnum } from "./category";

export enum TransactionTypeEnum {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type Transaction = {
  id?: string;
  type: TransactionTypeEnum;
  amount: number;
  categoryId: string;
  category: {
    id: string;
    name: CategoryEnum;
  };
  description: string;
  date: string;
  groupId?: string | null;
  group?: unknown | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type TransactionCategory = {
  categoryId: string;
  categoryName: string;
  total: number;
  transactionCount: number;
};

export type CreateTransactionDTO = {
  type: TransactionTypeEnum;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  groupId?: string | null;
};
