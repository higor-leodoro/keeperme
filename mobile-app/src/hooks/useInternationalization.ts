import { useTranslation } from "node_modules/react-i18next";

import { useInternationalizationStore } from "@/stores/internationalization.store";
import { formatCurrency } from "@/utils";

/**
 * Hook combinado para internacionalização
 * Fornece acesso a traduções, idioma e moeda em um único hook
 */
export const useInternationalization = () => {
  const { t } = useTranslation();
  const {
    language,
    setLanguage,
    toggleLanguage,
    currency,
    setCurrency,
    toggleCurrency,
  } = useInternationalizationStore();

  const formatValue = (value: number): string => {
    return formatCurrency(value, currency);
  };

  return {
    // Tradução
    t,

    // Idioma
    language,
    currentLanguage: language,
    setLanguage,
    changeLanguage: setLanguage,
    toggleLanguage,

    // Moeda
    currency,
    setCurrency,
    toggleCurrency,
    formatValue,
  };
};
