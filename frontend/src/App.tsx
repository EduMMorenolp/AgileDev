import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Login from "./components/Login"
import Chat from "./components/Chat"
import Sidebar from "./components/Sidebar"
import DocPreview from "./components/DocPreview"
import InteractiveForm from "./components/InteractiveForm"
import { setAuth, listProjects, listModels } from "./api/opencode"
import { useSession } from "./hooks/useSession"
import type { Project, OpenModel } from "./types"

const DEFAULT_MODEL = "opencode/deepseek-v4-flash-free"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [minimizedSidebar, setMinimizedSidebar] = useState(false)
  const [minimizedPanel, setMinimizedPanel] = useState(false)
  const [authError, setAuthError] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [models, setModels] = useState<OpenModel[]>([])
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const modelRef = useRef(DEFAULT_MODEL)
  const { messages, loading, error, start, send } = useSession()

  useEffect(() => {
    modelRef.current = selectedModel
  }, [selectedModel])

  const handleLogin = useCallback(async (user: string, pass: string) => {
    setAuth(user, pass)
    try {
      const [m] = await Promise.all([listModels(), listProjects()])
      setModels(m)
      if (m.some((x) => `${x.providerID}/${x.id}` === DEFAULT_MODEL)) {
        setSelectedModel(DEFAULT_MODEL)
      } else if (m.length > 0) {
        setSelectedModel(`${m[0].providerID}/${m[0].id}`)
      }
      setLoggedIn(true)
      setAuthError("")
      start()
    } catch (e: any) {
      setAuthError("Credenciales inválidas o servidor no disponible")
    }
  }, [start])

  // Smart polling to fetch projects list
  useEffect(() => {
    if (!loggedIn) return
    
    const fetchProj = async () => {
      try {
        const p = await listProjects()
        setProjects(p)
      } catch {}
    }

    fetchProj() // Initial fetch
    const interval = setInterval(fetchProj, 5000)
    return () => clearInterval(interval)
  }, [loggedIn])

  const handleSend = useCallback(
    (text: string) => send(text, modelRef.current),
    [send]
  )

  // Calculate current step and detected variables from assistant metadata
  const currentStepAndMeta = useMemo(() => {
    if (messages.length === 0) return { step: 0, vars: {} }

    const assistantMessages = messages.filter((m) => m.info.role === "assistant" || m.info.role === "model")
    if (assistantMessages.length === 0) return { step: 1, vars: {} }

    const lastMsg = assistantMessages[assistantMessages.length - 1]
    const rawText = lastMsg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n")

    let step = 1
    let vars: Record<string, string> = {}

    // Try to parse structured metadata first
    const metaMatch = rawText.match(/===METADATOS===[\s\S]*?```json([\s\S]*?)```[\s\S]*?===FIN METADATOS===/)
    if (metaMatch && metaMatch[1]) {
      try {
        const metaData = JSON.parse(metaMatch[1].trim())
        if (typeof metaData.paso_activo === "number" && metaData.paso_activo >= 1 && metaData.paso_activo <= 12) {
          step = metaData.paso_activo
        }
        if (metaData.variables_detectadas && typeof metaData.variables_detectadas === "object") {
          vars = metaData.variables_detectadas
        }
      } catch (err) {
        console.error("Error parsing metadata from message:", err)
      }
    } else {
      // Keyword scan fallback for step only
      const text = rawText.toUpperCase()
      if (text.includes("NOMBRE LE PONES") || text.includes("FECHA DE INICIO")) step = 1
      else if (text.includes("SECCION A") || text.includes("VISION")) step = 2
      else if (text.includes("SECCION B") || text.includes("TECNOLOGIA") || text.includes("STACK")) step = 3
      else if (text.includes("SECCION C") || text.includes("USABILIDAD")) step = 4
      else if (text.includes("SECCION D") || text.includes("FUNCIONALIDADES")) step = 5
      else if (text.includes("SECCION E") || text.includes("HISTORIAS")) step = 6
      else if (text.includes("SECCION F") || text.includes("SPRINTS")) step = 7
      else if (text.includes("SECCION G") || text.includes("STAKEHOLDERS")) step = 8
      else if (text.includes("SECCION H") || text.includes("RIESGOS")) step = 9
      else if (text.includes("SECCION I") || text.includes("VALOR")) step = 10
      else if (text.includes("SECCION J") || text.includes("METRICAS")) step = 11
      else if (text.includes("NUEVO") && text.includes("EXISTENTE")) step = 12
      else {
        const approxStep = Math.min(12, Math.floor(assistantMessages.length))
        step = Math.max(1, approxStep)
      }
    }

    return { step, vars }
  }, [messages])

  // Get docs of the selected project (filtering out _defaults.json from the active lists)
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.slug && p.slug !== "_defaults.json" && !p.slug.endsWith(".json"))
  }, [projects])

  const activeProject = filteredProjects.find((p) => p.slug === selectedProject)
  const docs = activeProject ? activeProject.docs : []

  if (!loggedIn) {
    return <Login onLogin={handleLogin} error={authError} />
  }

  return (
    <div className="relative flex min-h-screen w-screen bg-gray-950">
      {/* Premium radial glowing gradients behind the UI */}
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-radial-1" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      {/* Main split-screen layout */}
      <div className="relative z-10 flex h-full w-full overflow-hidden flex-col md:flex-row">
        {/* Sidebar: full width on small screens, fixed on md+ */}
        <div className={`${minimizedSidebar ? "w-20" : "w-full md:w-72"} md:flex-shrink-0 transition-all duration-300`}>
          <div className="hidden md:block h-full">
            <Sidebar
              projects={filteredProjects}
              selected={selectedProject}
              onSelect={(slug) => {
                setSelectedProject(slug)
                if (slug === null) {
                  start()
                }
              }}
              isMinimized={minimizedSidebar}
              onToggleMinimize={() => setMinimizedSidebar(!minimizedSidebar)}
            />
          </div>
          {/* Mobile overlay version */}
          {showSidebar && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
              <div className="relative h-full w-72">
                <Sidebar
                  projects={filteredProjects}
                  selected={selectedProject}
                  onSelect={(slug) => {
                    setSelectedProject(slug)
                    setShowSidebar(false)
                    if (slug === null) start()
                  }}
                  onClose={() => setShowSidebar(false)}
                  isMinimized={false}
                  onToggleMinimize={() => {}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat / Interview Panel */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Chat
            messages={messages}
            loading={loading}
            error={error}
            onSend={handleSend}
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            // allow chat header to open mobile sidebar
            onToggleSidebar={() => setShowSidebar((s) => !s)}
          />
        </div>

        {/* Dynamic Right Panel: hidden on small screens to avoid overflow; visible on md+ */}
        <div className={`${minimizedPanel ? "w-16" : "hidden md:flex md:w-96 lg:w-1/4"} flex-col transition-all duration-300`}>
          {selectedProject ? (
            <DocPreview projectSlug={selectedProject} docs={docs} isMinimized={minimizedPanel} onToggleMinimize={() => setMinimizedPanel(!minimizedPanel)} />
          ) : currentStepAndMeta.step > 0 ? (
            <InteractiveForm
              currentStep={currentStepAndMeta.step}
              detectedVariables={currentStepAndMeta.vars}
              onSend={handleSend}
              disabled={loading}
              isMinimized={minimizedPanel}
              onToggleMinimize={() => setMinimizedPanel(!minimizedPanel)}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
