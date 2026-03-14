import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "keeperme" });

export const setToken = (token: string) => {
  storage.set("token", token);
};

export const getToken = () => {
  return storage.getString("token");
};

export const removeToken = () => {
  storage.delete("token");
};

export const setCurrency = (currency: string) => {
  storage.set("currency", currency);
};

export const getCurrency = () => {
  return storage.getString("currency");
};

export const removeCurrency = () => {
  storage.delete("currency");
};

export const setLanguage = (language: string) => {
  storage.set("language", language);
};

export const getLanguage = () => {
  return storage.getString("language");
};

export const removeLanguage = () => {
  storage.delete("language");
};
