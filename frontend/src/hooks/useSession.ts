import { useState, useCallback, useRef } from "react"
import type { Message } from "../types"
import { createSession, sendMessage } from "../api/opencode"

export function useSession() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const sessionId = useRef<string | null>(null)

  const start = useCallback(async () => {
    try {
      const s = await createSession()
      sessionId.current = s.id
      setMessages([])
      setError("")
    } catch (e: any) {
      setError(e.message)
    }
  }, [])

  const send = useCallback(async (text: string, model?: string) => {
    if (!sessionId.current) return
    setLoading(true)
    setError("")
    const userMsg: Message = {
      info: { id: Date.now().toString(), role: "user" },
      parts: [{ type: "text", text }],
    }
    setMessages((prev) => [...prev, userMsg])
    try {
      const reply = await sendMessage(sessionId.current!, text, model)
      setMessages((prev) => [...prev, reply])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { messages, loading, error, start, send }
}
