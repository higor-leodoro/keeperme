"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3001";

type AuthResult = { success: true } | { success: false; error: string };

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json();
      return {
        success: false,
        error: body.message || "Invalid credentials",
      };
    }

    const { token } = await response.json();
    await setAuthCookie(token);
    return { success: true };
  } catch {
    return { success: false, error: "Unable to connect to server" };
  }
}

export async function registerAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      return {
        success: false,
        error: body.message || "Registration failed",
      };
    }

    const { token } = await response.json();
    await setAuthCookie(token);
    return { success: true };
  } catch {
    return { success: false, error: "Unable to connect to server" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function googleLoginAction(data: {
  token: string;
}): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json();
      return {
        success: false,
        error: body.message || "Google sign-in failed",
      };
    }

    const { token } = await response.json();
    await setAuthCookie(token);
    return { success: true };
  } catch {
    return { success: false, error: "Unable to connect to server" };
  }
}
