import type { OpenModel } from "../types"

interface Props {
  models: OpenModel[]
  selected: string
  onChange: (modelId: string) => void
}

export default function ModelSelector({ models, selected, onChange }: Props) {
  const free = models.filter((m) => m.cost.input === 0 && m.cost.output === 0)
  const paid = models.filter((m) => m.cost.input > 0 || m.cost.output > 0)
  const grouped = [
    { label: "Gratis", items: free },
    { label: "De pago", items: paid },
  ]

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-emerald-500"
    >
      {grouped.map(
        (g) =>
          g.items.length > 0 && (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((m) => (
                <option key={m.id} value={`${m.providerID}/${m.id}`}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          )
      )}
    </select>
  )
}
