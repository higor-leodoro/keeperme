import { useInternationalizationStore } from "@/stores/internationalization.store";
import { formatCurrency } from "@/utils";

export const useCurrency = () => {
  const { currency, setCurrency, toggleCurrency } =
    useInternationalizationStore();

  const formatValue = (value: number): string => {
    return formatCurrency(value, currency);
  };

  return {
    currency,
    setCurrency,
    toggleCurrency,
    formatValue,
  };
};
