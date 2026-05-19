const BASE = "/api"

let _username = ""
let _password = ""

export function setAuth(user: string, pass: string) {
  _username = user
  _password = pass
}

function authHeader(): string {
  return "Basic " + btoa(`${_username}:${_password}`)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = `Error ${res.status}`
    try {
      const j = JSON.parse(text)
      msg = j.data?.message || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export async function createSession(): Promise<{ id: string }> {
  return request("/session", { method: "POST", body: "{}" })
}

export async function sendMessage(
  sessionId: string,
  text: string,
  modelId?: string
): Promise<import("../types").Message> {
  const model = modelId
    ? { providerID: modelId.split("/")[0], modelID: modelId.split("/")[1] }
    : undefined
  return request(`/session/${sessionId}/message`, {
    method: "POST",
    body: JSON.stringify({
      agent: "pm-navigator",
      model,
      parts: [{ type: "text", text }],
    }),
  })
}

export async function listProjects(): Promise<import("../types").Project[]> {
  return request("/file?path=proyectos")
}

export async function listModels(): Promise<import("../types").OpenModel[]> {
  const data: any = await request("/config/providers")
  const models: import("../types").OpenModel[] = []
  for (const p of data.providers || []) {
    for (const key in p.models || {}) {
      const m = p.models[key]
      models.push({ ...m, providerID: p.id })
    }
  }
  return models
}
