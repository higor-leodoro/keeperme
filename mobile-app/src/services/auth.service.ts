import { api } from "./config";

import { Login, User } from "@/types";
import { getToken, setToken } from "@/utils/local.storage";
export const loginWithGoogle = async (token: string): Promise<Login> => {
  try {
    const { data } = await api.post<Login>("/auth/google", {
      token,
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginWithApple = async (identityToken: string): Promise<Login> => {
  try {
    const { data } = await api.post<Login>("/auth/apple", {
      identityToken,
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const autoLogin = async (): Promise<User | undefined> => {
  try {
    const token = getToken();
    if (!token) return undefined;

    const { data } = await api.post<User>("/auth/me", { token });
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
