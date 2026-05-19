import { useState } from "react"

interface Props {
  onLogin: (user: string, pass: string) => void
  error: string
}

export default function Login({ onLogin, error }: Props) {
  const [user, setUser] = useState("adreapm")
  const [pass, setPass] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(user, pass)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">AgileDev</h1>
          <p className="mt-1 text-sm text-gray-400">Product Manager Suite</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Usuario</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="usuario"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="contraseña"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}
