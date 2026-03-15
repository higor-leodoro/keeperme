const BASE = "/api"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}

export const api = {
  get: <T>(path: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return request<T>(`${path}${qs}`)
  },
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
}
