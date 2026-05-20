import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface Props {
  projectSlug: string | null
  docs: string[]
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

const TABS = [
  { id: "vision", name: "Visión del Producto", path: "product-vision.md" },
  { id: "funcionales", name: "R. Funcionales", path: "requerimientos/funcionales.md" },
  { id: "nofuncionales", name: "R. No Funcionales", path: "requerimientos/no-funcionales.md" },
  { id: "backlog", name: "Product Backlog", path: "backlog/backlog.md" },
  { id: "sprint", name: "Sprint Plan", path: "backlog/sprint-plan.md" },
  { id: "roadmap", name: "Roadmap", path: "roadmap-sprints.md" },
  { id: "tasks", name: "Task Cards", path: "task-cards.md" },
  { id: "changelog", name: "Changelog", path: "../changelog.md" }, // located in parent of docs/
]

// Custom Markdown Table Parser for the DocPreview
function parseBlocks(text: string) {
  const lines = text.split("\n")
  const blocks: { type: "markdown" | "table" | "mermaid"; content: string | string[][] }[] = []
  let currentTable: string[][] = []
  let inTable = false
  let inMermaid = false
  let mermaidContent = ""

  for (const line of lines) {
    const trimmed = line.trim()

    // Handle Mermaid block
    if (trimmed.startsWith("```mermaid")) {
      inMermaid = true
      mermaidContent = ""
      continue
    }
    if (inMermaid) {
      if (trimmed.startsWith("```")) {
        inMermaid = false
        blocks.push({ type: "mermaid", content: mermaidContent })
        continue
      }
      mermaidContent += line + "\n"
      continue
    }

    // Handle Table block
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

export default function DocPreview({ projectSlug, docs, isMinimized = false, onToggleMinimize }: Props) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [frontmatter, setFrontmatter] = useState<Record<string, string>>({})
  const renderRef = useRef<HTMLDivElement>(null)

  const [zoomScale, setZoomScale] = useState(1.0)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.0, prev + 0.15))
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.5, prev - 0.15))
  const handleZoomReset = () => setZoomScale(1.0)

  const handleCopyMermaid = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  // Reset zoom when switching tabs
  useEffect(() => {
    setZoomScale(1.0)
  }, [activeTab])

  const currentTabInfo = TABS.find((t) => t.id === activeTab)!
  const hasDoc = projectSlug && (
    activeTab === "changelog" || // changelog is always expected or handled gracefully
    docs.some((d) => d.replace(/\\/g, "/").includes(currentTabInfo.path))
  )

  useEffect(() => {
    if (!projectSlug || !hasDoc) {
      setContent("")
      setFrontmatter({})
      return
    }

    const loadFile = async () => {
      setLoading(true)
      setError("")
      setContent("")
      setFrontmatter({})
      try {
        const filePath = activeTab === "changelog" ? "changelog.md" : `docs/${currentTabInfo.path}`
        const url = `/docs/${projectSlug}/${filePath}`
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error("El archivo aún no fue generado por los agentes.")
        }
        const text = await res.text()

        // Extract Frontmatter
        let md = text
        const fm: Record<string, string> = {}
        if (text.startsWith("---")) {
          const parts = text.split("---")
          if (parts.length >= 3) {
            const yaml = parts[1]
            yaml.split("\n").forEach((line) => {
              const [key, ...valParts] = line.split(":")
              if (key && valParts.length > 0) {
                fm[key.trim()] = valParts.join(":").trim().replace(/['"]/g, "")
              }
            })
            md = parts.slice(2).join("---")
          }
        }
        setFrontmatter(fm)
        setContent(md.trim())
      } catch (e: any) {
        setError(e.message || "Error al cargar el documento")
      } finally {
        setLoading(false)
      }
    }

    loadFile()
  }, [projectSlug, activeTab, hasDoc])

  // Re-run Mermaid parser whenever content renders
  useEffect(() => {
    if (content && (window as any).mermaid) {
      setTimeout(() => {
        try {
          (window as any).mermaid.run()
        } catch (err) {
          console.error("Mermaid compile error:", err)
        }
      }, 100)
    }
  }, [content, activeTab])

  const parsedBlocks = parseBlocks(content)

  if (!projectSlug) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gray-950/20 text-center animate-fade-in">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 shadow-inner mb-4">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Previsualización de Entregables</h3>
        <p className="mt-2 text-xs text-gray-500 max-w-sm leading-relaxed">
          Selecciona un proyecto de la barra lateral o inicia una entrevista para visualizar sus especificaciones y diagramas ágiles en tiempo real.
        </p>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col h-full ${isMinimized ? "bg-gray-950/45 border-l border-glass" : "bg-gray-950/45 border-l border-glass"} overflow-hidden animate-fade-in z-0`}>
      {/* Dynamic Tab Bar */}
      <div className="flex overflow-x-auto bg-gray-900/40 border-b border-gray-800/80 px-4 py-2 scrollbar-none justify-between items-center">
        {isMinimized && onToggleMinimize ? (
          <button
            onClick={onToggleMinimize}
            title="Expandir"
            aria-label="Expandir panel"
            className="p-2 rounded hover:bg-gray-800/40"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <>
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap border ${
                    activeTab === tab.id
                      ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 shadow-sm"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            {onToggleMinimize && (
              <button
                onClick={onToggleMinimize}
                title="Minimizar"
                aria-label="Minimizar panel"
                className="p-2 rounded hover:bg-gray-800/40"
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Render Area */}
      <div ref={renderRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          // Shimmer Skeleton Loader
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-900 rounded-lg w-1/3" />
            <div className="h-4 bg-gray-900 rounded-lg w-1/4" />
            <div className="border border-gray-900 rounded-2xl p-4 space-y-2">
              <div className="h-3.5 bg-gray-900 rounded w-full" />
              <div className="h-3.5 bg-gray-900 rounded w-11/12" />
              <div className="h-3.5 bg-gray-900 rounded w-4/5" />
            </div>
            <div className="h-48 bg-gray-900 rounded-2xl w-full" />
          </div>
        ) : error || !hasDoc ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-3.5">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Documento Pendiente</h4>
            <p className="mt-2 text-xs text-gray-500 max-w-sm leading-relaxed">
              {error || "Este entregable no se encuentra generado en el proyecto. Completa los pasos restantes de la entrevista para disparar la generación automatizada."}
            </p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-5">
            {/* Frontmatter Metadata Banner */}
            {Object.keys(frontmatter).length > 0 && (
              <div className="flex flex-wrap gap-2.5 bg-gray-900/30 border border-gray-800/60 rounded-xl p-3.5">
                {Object.entries(frontmatter).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-800/40 border border-gray-800/60 px-2.5 py-1 rounded">
                    <span className="text-gray-500 uppercase tracking-wider">{k}:</span>
                    <span className="text-gray-300">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Document Content Renderer */}
            <div className="custom-prose max-w-none">
              {parsedBlocks.map((block, idx) => {
                if (block.type === "mermaid") {
                  const code = block.content as string
                  return (
                    <div key={idx} className="my-5 border border-gray-800/60 bg-gray-900/25 p-5 rounded-2xl flex flex-col shadow-inner relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-4 w-full">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                          Diagrama Visual Interactivo
                        </div>
                        
                        {/* Interactive Controls */}
                        <div className="flex items-center gap-1 bg-gray-900/60 border border-gray-800 rounded-lg p-0.5">
                          <button
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition text-[10px]"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-[9px] font-bold text-gray-500 px-1 min-w-[32px] text-center">
                            {Math.round(zoomScale * 100)}%
                          </span>
                          <button
                            onClick={handleZoomIn}
                            title="Zoom In"
                            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition text-[10px]"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button
                            onClick={handleZoomReset}
                            title="Reset Zoom"
                            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition text-[10px] border-l border-gray-800/80 ml-0.5 pl-1.5"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.25" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCopyMermaid(code, idx)}
                            title="Copiar código Mermaid"
                            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition text-[10px] border-l border-gray-800/80 ml-0.5 pl-1.5"
                          >
                            {copiedIdx === idx ? (
                              <span className="text-[8px] text-emerald-400 font-extrabold uppercase px-0.5">Copiado</span>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Scalable Chart Wrapper */}
                      <div className="overflow-x-auto overflow-y-hidden w-full flex justify-center py-4 bg-gray-900/10 rounded-xl border border-dashed border-gray-800/60 shadow-inner">
                        <div 
                          className="mermaid w-full flex justify-center"
                          style={{ 
                            transform: `scale(${zoomScale})`, 
                            transformOrigin: 'top center',
                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          {code}
                        </div>
                      </div>
                    </div>
                  )
                }

                if (block.type === "table") {
                  const rows = block.content as string[][]
                  const headers = rows[0] || []
                  const bodyRows = rows.slice(1) || []

                  return (
                    <div key={idx} className="overflow-x-auto my-4 border border-gray-800/80 rounded-xl shadow-md">
                      <table className="min-w-full divide-y divide-gray-800 bg-gray-900/10">
                        <thead className="bg-gray-800/45">
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/40">
                          {bodyRows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-gray-800/10 transition-colors">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-2.5 text-xs text-gray-300 leading-normal">
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
                  <ReactMarkdown key={idx}>
                    {block.content as string}
                  </ReactMarkdown>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
