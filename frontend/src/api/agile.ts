const BASE = "/api"

let _token: string | null = localStorage.getItem("agile_token")

export function getToken(): string | null {
  return _token
}

export function setToken(token: string | null) {
  _token = token
  if (token) {
    localStorage.setItem("agile_token", token)
  } else {
    localStorage.removeItem("agile_token")
  }
}

export function isLoggedIn(): boolean {
  return !!_token
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (_token) {
    headers["Authorization"] = `Bearer ${_token}`
  }

  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string>),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`)
  }

  return data
}

export interface AuthResult {
  token: string
  user: { id: number; username: string; email: string }
}

export function register(username: string, email: string, password: string): Promise<AuthResult> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  })
}

export function login(username: string, password: string): Promise<AuthResult> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function getMe(): Promise<{ user: { id: number; username: string; email: string } }> {
  return request("/auth/me")
}

export interface ChatSession {
  id: number
  opencode_session_id: string
  project_slug: string | null
  project_name: string | null
  status: string
  messages_preview?: string
  messages?: any[]
  created_at: string
  updated_at: string
}

export function listSessions(): Promise<{ sessions: ChatSession[] }> {
  return request("/sessions")
}

export function getSession(id: number): Promise<{ session: ChatSession }> {
  return request(`/sessions/${id}`)
}

export function saveSession(data: {
  opencode_session_id: string
  project_slug?: string | null
  project_name?: string | null
  messages?: any[]
  status?: string
}): Promise<{ id: number }> {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateSession(
  id: number,
  data: {
    status?: string
    messages?: any[]
    project_slug?: string | null
    project_name?: string | null
  }
): Promise<{ success: boolean }> {
  return request(`/sessions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteSession(id: number): Promise<{ success: boolean }> {
  return request(`/sessions/${id}`, {
    method: "DELETE",
  })
}

export function listUserProjects(): Promise<{ projects: any[] }> {
  return request("/projects")
}

export function saveProject(data: { slug: string; name: string }): Promise<{ id: number }> {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateProjectStatus(slug: string, status: "incomplete" | "complete"): Promise<{ success: boolean }> {
  return request(`/projects/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
