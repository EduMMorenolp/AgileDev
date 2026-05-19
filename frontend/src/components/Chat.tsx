import { useEffect, useRef } from "react"
import type { Message, OpenModel } from "../types"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import ModelSelector from "./ModelSelector"

interface Props {
  messages: Message[]
  loading: boolean
  error: string
  onSend: (text: string) => void
  models: OpenModel[]
  selectedModel: string
  onModelChange: (m: string) => void
}

export default function Chat({
  messages,
  loading,
  error,
  onSend,
  models,
  selectedModel,
  onModelChange,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <span className="text-sm font-medium text-gray-300">pm-navigator</span>
        {models.length > 0 && (
          <ModelSelector
            models={models}
            selected={selectedModel}
            onChange={onModelChange}
          />
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-400">Entrevista PM Navigator</p>
              <p className="mt-1 text-sm text-gray-500">
                Escribí "hola" para iniciar la entrevista
              </p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.info.id} role={m.info.role} parts={m.parts} />
        ))}
        {loading && (
          <div className="flex items-start gap-2 pl-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              PM
            </div>
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  )
}
