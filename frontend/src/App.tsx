import { useState, useEffect, useCallback, useRef } from "react"
import Login from "./components/Login"
import Chat from "./components/Chat"
import Sidebar from "./components/Sidebar"
import { setAuth, listProjects, listModels } from "./api/opencode"
import { useSession } from "./hooks/useSession"
import type { Project, OpenModel } from "./types"

const DEFAULT_MODEL = "opencode/deepseek-v4-flash-free"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
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

  useEffect(() => {
    if (!loggedIn) return
    const interval = setInterval(async () => {
      try {
        const p = await listProjects()
        setProjects(p)
      } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }, [loggedIn])

  const handleSend = useCallback(
    (text: string) => send(text, modelRef.current),
    [send]
  )

  if (!loggedIn) {
    return <Login onLogin={handleLogin} error={authError} />
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        projects={projects}
        selected={selectedProject}
        onSelect={setSelectedProject}
      />
      <Chat
        messages={messages}
        loading={loading}
        error={error}
        onSend={handleSend}
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  )
}
