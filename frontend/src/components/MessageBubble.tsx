import type { Part } from "../types"
import ReactMarkdown from "react-markdown"

interface Props {
  role: string
  parts: Part[]
}

export default function MessageBubble({ role, parts }: Props) {
  const text = parts.filter((p) => p.type === "text").map((p) => p.text).join("\n")
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-emerald-600 text-white"
            : "border border-gray-800 bg-gray-900 text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-code:rounded prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
