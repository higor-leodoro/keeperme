import { api } from "./config";

import {
  CreateTransactionDTO,
  Transaction,
  TransactionCategory,
} from "@/types";

type GetTransactionsAllCategoriesParams = {
  type?: string;
  groupId?: string;
  startDate?: string;
  endDate?: string;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data } = await api.get<Transaction[]>("/transactions");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTransactionsAllCategories = async (
  params?: GetTransactionsAllCategoriesParams
): Promise<TransactionCategory[]> => {
  try {
    const { data } = await api.get<TransactionCategory[]>(
      "/transactions/all-categories",
      { params }
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTransaction = async (
  transaction: CreateTransactionDTO
): Promise<Transaction> => {
  try {
    const { data } = await api.post<Transaction>("/transactions", transaction);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTransaction = async (
  id: string,
  transaction: Partial<Transaction>
): Promise<Transaction> => {
  try {
    const { data } = await api.patch<Transaction>(
      `/transactions/${id}`,
      transaction
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
