import i18n from "i18next";
import { initReactI18next } from "node_modules/react-i18next";
import { NativeModules, Platform } from "react-native";

import enUS from "./locales/en-US";
import ptBR from "./locales/pt-BR";

const resources = {
  "en-US": { translation: enUS },
  "pt-BR": { translation: ptBR },
  en: { translation: enUS },
  pt: { translation: ptBR },
};

// Detecta o idioma do dispositivo
const getDeviceLanguage = (): string => {
  let locale = "pt-BR";

  if (Platform.OS === "ios") {
    locale =
      NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      "pt-BR";
  } else if (Platform.OS === "android") {
    locale = NativeModules.I18nManager?.localeIdentifier || "pt-BR";
  }

  // Normaliza o locale (pt_BR -> pt-BR, en -> en-US, etc)
  const normalizedLocale = locale.replace(/_/g, "-");

  // Verifica se temos tradução exata
  if (resources[normalizedLocale as keyof typeof resources]) {
    return normalizedLocale;
  }

  // Verifica apenas o idioma base (pt, en)
  const baseLanguage = normalizedLocale.split("-")[0];
  if (resources[baseLanguage as keyof typeof resources]) {
    return baseLanguage;
  }

  return "pt-BR"; // fallback para português
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "pt-BR",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
