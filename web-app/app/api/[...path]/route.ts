import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL || "http://localhost:3001"

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const url = new URL(`${API_URL}/${path.join("/")}`)
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  }

  if (req.method !== "GET" && req.method !== "DELETE") {
    try {
      const body = await req.text()
      if (body) {
        fetchOptions.body = body
      }
    } catch {
      // no body
    }
  }

  try {
    const response = await fetch(url.toString(), fetchOptions)
    const data = await response.text()

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    })
  } catch {
    return NextResponse.json({ message: "Backend unavailable" }, { status: 502 })
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const PUT = proxyRequest
