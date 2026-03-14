import { useGetBalance, useGetTransactionAllCategories } from "@/hooks/queries";
import { useAuthStore } from "@/stores";

export default function useHomeViewModel() {
  const { user } = useAuthStore();
  const { data: balance } = useGetBalance();
  const { data: categorySummary = [] } = useGetTransactionAllCategories();

  return {
    user,
    categorySummary,
    balance,
  };
}
