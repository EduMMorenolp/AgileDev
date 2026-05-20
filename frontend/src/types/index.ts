export interface Session {
  id: string
  title?: string
  parentID?: string
}

export interface Part {
  type: string
  text?: string
}

export interface Message {
  info: { id: string; role: string }
  parts: Part[]
}

export interface Project {
  name: string
  slug: string
  docs: string[]
}

export interface OpenModel {
  id: string
  providerID: string
  name: string
  family: string
  cost: { input: number; output: number }
  status: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
}
