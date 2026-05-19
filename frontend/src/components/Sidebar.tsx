import { useState } from "react"
import type { Project } from "../types"

interface Props {
  projects: Project[]
  onSelect: (slug: string) => void
  selected: string | null
}

export default function Sidebar({ projects, onSelect, selected }: Props) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-800 bg-gray-900">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Proyectos
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 && (
          <p className="px-2 text-sm text-gray-500">
            Usá el chat para crear tu primer proyecto
          </p>
        )}
        {projects.map((p) => (
          <button
            key={p.slug}
            onClick={() => onSelect(p.slug)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selected === p.slug
                ? "bg-emerald-600/20 text-emerald-400"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {p.name}
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <a
          href="/docs/"
          target="_blank"
          className="block rounded-lg bg-gray-800 px-3 py-2 text-center text-sm text-gray-300 transition-colors hover:bg-gray-700"
        >
          Ver docs
        </a>
      </div>
    </aside>
  )
}
