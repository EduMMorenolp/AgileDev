import { useMemo } from "react"
import type { Message } from "../types"

interface Props {
  messages: Message[]
}

const STEPS = [
  { id: 1, name: "Proyecto" },
  { id: 2, name: "Visión" },
  { id: 3, name: "Tech" },
  { id: 4, name: "Usabilidad" },
  { id: 5, name: "Épicas" },
  { id: 6, name: "Historias" },
  { id: 7, name: "Sprints" },
  { id: 8, name: "Socios" },
  { id: 9, name: "Riesgos" },
  { id: 10, name: "Negocio" },
  { id: 11, name: "Métricas" },
  { id: 12, name: "Tipo" },
]

export default function Stepper({ messages }: Props) {
  const currentStep = useMemo(() => {
    if (messages.length === 0) return 0

    // Find the last assistant message
    const assistantMessages = messages.filter((m) => m.info.role === "assistant" || m.info.role === "model")
    if (assistantMessages.length === 0) return 1

    const lastMsg = assistantMessages[assistantMessages.length - 1]
    const rawText = lastMsg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n")

    // Try to parse structured metadata first
    const metaMatch = rawText.match(/===METADATOS===[\s\S]*?```json([\s\S]*?)```[\s\S]*?===FIN METADATOS===/)
    if (metaMatch && metaMatch[1]) {
      try {
        const metaData = JSON.parse(metaMatch[1].trim())
        if (typeof metaData.paso_activo === "number" && metaData.paso_activo >= 1 && metaData.paso_activo <= 12) {
          return metaData.paso_activo
        }
      } catch (err) {
        console.error("Error parsing metadata from message:", err)
      }
    }

    // Backwards-compatible keyword scanning fallback
    const text = rawText.toUpperCase()
    if (text.includes("NOMBRE LE PONES") || text.includes("FECHA DE INICIO")) return 1
    if (text.includes("SECCION A") || text.includes("VISION")) return 2
    if (text.includes("SECCION B") || text.includes("TECNOLOGIA") || text.includes("STACK")) return 3
    if (text.includes("SECCION C") || text.includes("USABILIDAD")) return 4
    if (text.includes("SECCION D") || text.includes("FUNCIONALIDADES")) return 5
    if (text.includes("SECCION E") || text.includes("HISTORIAS")) return 6
    if (text.includes("SECCION F") || text.includes("SPRINTS")) return 7
    if (text.includes("SECCION G") || text.includes("STAKEHOLDERS")) return 8
    if (text.includes("SECCION H") || text.includes("RIESGOS")) return 9
    if (text.includes("SECCION I") || text.includes("VALOR")) return 10
    if (text.includes("SECCION J") || text.includes("METRICAS")) return 11
    if (text.includes("NUEVO") && text.includes("EXISTENTE")) return 12

    // Fallback based on message count approximation if no clear header
    const approxStep = Math.min(12, Math.floor(assistantMessages.length))
    return Math.max(1, approxStep)
  }, [messages])

  const progressPercent = useMemo(() => {
    if (currentStep === 0) return 0
    return Math.round((currentStep / STEPS.length) * 100)
  }, [currentStep])

  return (
    <div className="w-full bg-gray-900/60 border-b border-gray-800/80 px-6 py-3.5 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
            {currentStep > 0 ? currentStep : 0}
          </span>
          <p className="text-xs font-semibold text-gray-200 tracking-wide">
            {currentStep > 0 ? `Entrevista: ${STEPS[currentStep - 1].name}` : "Inicio de entrevista"}
          </p>
        </div>
        <span className="text-[10px] font-bold text-gray-500 bg-gray-800/40 px-2 py-0.5 rounded border border-gray-800/60">
          {progressPercent}% completado
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Dots Indicator */}
      <div className="flex justify-between items-center px-1">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep
          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center group cursor-help`}
              title={step.name}
            >
              <div
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : isActive
                    ? "bg-teal-400 scale-125 border border-teal-200 shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              />
              {/* Tooltip on Hover */}
              <div className="absolute bottom-4 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-900 border border-gray-800 text-[9px] text-gray-300 px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-50">
                {step.id}. {step.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
