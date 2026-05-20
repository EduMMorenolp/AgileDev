import type { Part } from "../types"
import ReactMarkdown from "react-markdown"

interface Props {
  role: string
  parts: Part[]
}

// Custom Markdown Table Parser to avoid external dependencies
function parseBlocks(text: string) {
  const lines = text.split("\n")
  const blocks: { type: "markdown" | "table"; content: string | string[][] }[] = []
  let currentTable: string[][] = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    const isTableRow = trimmed.startsWith("|") && trimmed.endsWith("|")

    if (isTableRow) {
      if (!inTable) {
        inTable = true
        currentTable = []
      }
      const cols = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())
      
      const isSeparator = cols.every((c) => c.match(/^:?-+:?$/))
      if (!isSeparator) {
        currentTable.push(cols)
      }
    } else {
      if (inTable) {
        inTable = false
        if (currentTable.length > 0) {
          blocks.push({ type: "table", content: currentTable })
        }
      }
      
      if (blocks.length > 0 && blocks[blocks.length - 1].type === "markdown") {
        blocks[blocks.length - 1].content += "\n" + line
      } else {
        blocks.push({ type: "markdown", content: line })
      }
    }
  }

  if (inTable && currentTable.length > 0) {
    blocks.push({ type: "table", content: currentTable })
  }

  return blocks
}

export default function MessageBubble({ role, parts }: Props) {
  const rawText = parts.filter((p) => p.type === "text").map((p) => p.text).join("\n")
  
  // Strip metadata blocks from assistant messages
  const text = rawText.replace(/===METADATOS===([\s\S]*?)===FIN METADATOS===/g, "").trim()
  const isUser = role === "user"
  const blocks = parseBlocks(text)

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} items-end gap-3.5 mb-2.5 animate-slide-up`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] border border-emerald-400/20">
          <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] md:max-w-[65%] lg:max-w-[55%] px-4 py-3 shadow-lg transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl rounded-br-none shadow-[0_4px_14px_rgba(16,185,129,0.15)]"
            : "bg-gray-900/80 border border-gray-800/80 text-gray-100 rounded-3xl rounded-bl-none backdrop-blur-md"
        }`}
      >
        {isUser ? (
          <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium break-words">{text}</p>
        ) : (
          <div className="space-y-2 break-words">
            {blocks.map((block, idx) => {
              if (block.type === "table") {
                const rows = block.content as string[][]
                const headers = rows[0] || []
                const bodyRows = rows.slice(1) || []

                return (
                  <div key={idx} className="overflow-x-auto my-3 border border-gray-800/50 rounded-lg max-w-full">
                    <table className="min-w-full divide-y divide-gray-800 bg-gray-950/40">
                      <thead className="bg-gray-800/30">
                        <tr>
                          {headers.map((h, i) => (
                            <th key={i} className="px-3.5 py-2 text-left text-[11px] font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/40 bg-transparent">
                        {bodyRows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-gray-800/10">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3.5 py-2 text-xs text-gray-300 leading-normal">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }

              return (
                <ReactMarkdown key={idx} className="custom-prose">
                  {block.content as string}
                </ReactMarkdown>
              )
            })}
          </div>
        )}
      </div>

      {/* User Avatar Placeholder to align height nicely */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-inner">
          ME
        </div>
      )}
    </div>
  )
}
