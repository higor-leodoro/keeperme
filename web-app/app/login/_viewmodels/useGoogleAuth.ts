"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLoginAction } from "../_actions/auth";

export function useGoogleAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (response) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await googleLoginAction({
          token: response.access_token,
        });
        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in failed");
    },
  });

  return { login, isLoading, error };
}
