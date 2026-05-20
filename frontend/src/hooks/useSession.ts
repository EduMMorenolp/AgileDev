import { useState, useCallback, useRef } from "react"
import type { Message } from "../types"
import { createSession, sendMessage } from "../api/opencode"
import { saveSession, updateSession, getSession } from "../api/agile"

export function useSession() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const sessionId = useRef<string | null>(null)
  const dbSessionId = useRef<number | null>(null)
  const projectName = useRef<string | null>(null)

  const persist = useCallback(async (msgs: Message[], status?: string) => {
    if (!sessionId.current) return
    try {
      const data: any = {
        opencode_session_id: sessionId.current,
        messages: msgs,
      }
      if (projectName.current) {
        data.project_name = projectName.current
        data.project_slug = slugify(projectName.current)
      }
      if (status) data.status = status

      if (dbSessionId.current) {
        await updateSession(dbSessionId.current, data)
      } else {
        const result = await saveSession(data)
        dbSessionId.current = result.id
      }
    } catch (err) {
      console.error("Failed to persist session:", err)
    }
  }, [])

  const start = useCallback(async (existingSessionId?: string) => {
    try {
      if (existingSessionId) {
        sessionId.current = existingSessionId
        return
      }
      const s = await createSession()
      sessionId.current = s.id
      setMessages([])
      setError("")
      dbSessionId.current = null
    } catch (e: any) {
      setError(e.message)
    }
  }, [])

  const restore = useCallback(async (dbId: number) => {
    try {
      const { session } = await getSession(dbId)
      dbSessionId.current = dbId
      sessionId.current = session.opencode_session_id
      projectName.current = session.project_name
      setMessages(session.messages || [])
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
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)

    // Try to extract project name from first user message
    if (!projectName.current && text.toLowerCase().includes("proyecto")) {
      const match = text.match(/(?:proyecto|proyecto se llama|nombre del proyecto)[":]?\s*"?([^".]+)/i)
      if (match) {
        projectName.current = match[1].trim()
      }
    }

    try {
      const reply = await sendMessage(sessionId.current!, text, model)
      const newMessages = [...updatedMessages, reply]
      setMessages(newMessages)
      persist(newMessages)

      // Mark project as complete when we reach step 12
      const replyText = reply.parts.filter(p => p.type === "text").map(p => p.text).join("\n")
      if (replyText.includes("===METADATOS===")) {
        const metaMatch = replyText.match(/===METADATOS===[\s\S]*?```json([\s\S]*?)```/)
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1].trim())
            if (meta.paso_activo === 12) {
              persist(newMessages, "completed")
            }
          } catch {}
        }
      }
    } catch (e: any) {
      setError(e.message)
      persist(updatedMessages)
    } finally {
      setLoading(false)
    }
  }, [messages, persist])

  return { messages, setMessages, loading, error, start, send, restore, sessionId: sessionId.current }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
