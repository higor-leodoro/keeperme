import i18n from "i18next";
import { create } from "zustand";

import {
  getCurrency,
  getLanguage,
  setCurrency as saveCurrency,
  setLanguage as saveLanguage,
} from "@/utils/local.storage";

export type Currency = "BRL" | "USD";
export type Language = "pt-BR" | "en-US";

type InternationalizationStoreProps = {
  currency: Currency;
  language: Language;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  initialize: () => void;
};

export const useInternationalizationStore =
  create<InternationalizationStoreProps>((set, get) => ({
    currency: "BRL",
    language: "pt-BR",

    setCurrency: (currency: Currency) => {
      saveCurrency(currency);
      set({ currency });
    },

    toggleCurrency: () => {
      const currentCurrency = get().currency;
      const newCurrency: Currency = currentCurrency === "BRL" ? "USD" : "BRL";
      saveCurrency(newCurrency);
      set({ currency: newCurrency });
    },

    setLanguage: (language: Language) => {
      saveLanguage(language);
      i18n.changeLanguage(language);
      set({ language });
    },

    toggleLanguage: () => {
      const currentLanguage = get().language;
      const newLanguage: Language =
        currentLanguage === "pt-BR" ? "en-US" : "pt-BR";
      saveLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
      set({ language: newLanguage });
    },

    initialize: () => {
      const savedCurrency = getCurrency();
      const savedLanguage = getLanguage();

      if (savedCurrency) {
        set({ currency: savedCurrency as Currency });
      }

      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        set({ language: savedLanguage as Language });
      }
    },
  }));
