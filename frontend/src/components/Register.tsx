import { useState } from "react"
import { register as apiRegister } from "../api/agile"

interface Props {
  onRegister: (token: string) => void
  onSwitchToLogin: () => void
  error: string
}

export default function Register({ onRegister, onSwitchToLogin, error }: Props) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!username || !email || !password) {
      setLocalError("Completá todos los campos")
      return
    }
    if (password !== confirm) {
      setLocalError("Las contraseñas no coinciden")
      return
    }
    if (password.length < 4) {
      setLocalError("La contraseña debe tener al menos 4 caracteres")
      return
    }

    setLoading(true)
    try {
      const result = await apiRegister(username, email, password)
      onRegister(result.token)
    } catch (err: any) {
      setLocalError(err.message || "Error al registrar")
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-gray-400">AgileDev Product Manager Suite</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="usuario"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="email@ejemplo.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="mínimo 4 caracteres"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="repetí la contraseña"
              autoComplete="new-password"
            />
          </div>
        </div>

        {displayError && (
          <p className="mt-3 text-center text-sm text-red-400">{displayError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          ¿Ya tenés cuenta?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            Iniciar Sesión
          </button>
        </p>
      </form>
    </div>
  )
}
