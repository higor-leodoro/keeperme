import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { create } from "zustand";

import {
  autoLogin,
  loginWithApple,
  loginWithGoogle,
} from "@/services/auth.service";
import { User } from "@/types";
import { removeToken } from "@/utils/local.storage";

type AuthStoreProps = {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  signInWithGoogle: () => void;
  signInWithApple: (identityToken: string) => Promise<void>;
  signOut: () => void;
  autoSignIn: () => void;
};

export const useAuthStore = create<AuthStoreProps>((set) => ({
  isAuthenticated: false,
  user: {
    id: "",
    name: "",
    lastName: null,
    email: "",
    photo: null,
  },
  loading: false,
  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      if (!isSuccessResponse(googleResponse)) {
        return;
      }
      if (!googleResponse.data.idToken) {
        return;
      }
      const response = await loginWithGoogle(googleResponse.data.idToken);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === statusCodes.SIGN_IN_CANCELLED
      ) {
        return;
      }
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  signInWithApple: async (identityToken: string) => {
    if (!identityToken) {
      return;
    }
    try {
      set({ loading: true });
      const response = await loginWithApple(identityToken);
      set({ user: response.user, loading: false, isAuthenticated: true });
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
  autoSignIn: async () => {
    try {
      set({ loading: true });
      const user = await autoLogin();
      if (!user) {
        set({ loading: false, isAuthenticated: false });
        return;
      }
      set({ user: user, loading: false, isAuthenticated: true });
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
  signOut: () => {
    removeToken();
    set({ isAuthenticated: false });
  },
}));
