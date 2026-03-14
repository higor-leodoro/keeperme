import { useTranslation } from "node_modules/react-i18next";

import {
  useInternationalizationStore,
  Language,
} from "@/stores/internationalization.store";

export const useI18n = () => {
  const { t } = useTranslation();
  const { language, setLanguage, toggleLanguage } =
    useInternationalizationStore();

  const changeLanguage = (lng: Language) => {
    setLanguage(lng);
  };

  return {
    t,
    changeLanguage,
    toggleLanguage,
    currentLanguage: language,
  };
};
