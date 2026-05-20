import { Request, Response } from "express"

const OPCODE_URL = process.env.OPCODE_URL || "http://127.0.0.1:4096"
const ADMIN_USER = process.env.ADMIN_USER || "adreapm"
const ADMIN_PASS = process.env.ADMIN_PASS || "pm1234"

export async function proxyToOpencode(req: Request, res: Response) {
  const targetPath = req.originalUrl.replace(/^\/api/, "")
  const url = `${OPCODE_URL}${targetPath}${req.url.includes("?") ? "" : ""}${Object.keys(req.query).length > 0 ? "?" + new URLSearchParams(req.query as any).toString() : ""}`
  const body = req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined

  const auth = Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64")

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        ...(body ? { "Content-Length": Buffer.byteLength(body).toString() } : {}),
      },
      body,
      signal: AbortSignal.timeout(500_000),
    })

    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const data = await response.json()
      res.status(response.status).json(data)
    } else {
      const text = await response.text()
      res.status(response.status).type(contentType).send(text)
    }
  } catch (err: any) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      res.status(504).json({ error: "El servidor opencode tardó demasiado en responder" })
    } else {
      console.error("Proxy error:", err)
      res.status(502).json({ error: "Error de comunicación con el servidor opencode" })
    }
  }
}
