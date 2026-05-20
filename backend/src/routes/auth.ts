import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import { getDb } from "../db"
import { signToken, authMiddleware } from "../middleware/auth"

const router = Router()

router.post("/register", (req: Request, res: Response) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400).json({ error: "Faltan campos: username, email, password" })
    return
  }

  if (password.length < 4) {
    res.status(400).json({ error: "La contraseña debe tener al menos 4 caracteres" })
    return
  }

  const db = getDb()

  const existing = db.prepare("SELECT id FROM users WHERE username = ? OR email = ?").get(username, email)
  if (existing) {
    res.status(409).json({ error: "El usuario o email ya existe" })
    return
  }

  const password_hash = bcrypt.hashSync(password, 10)

  const result = db.prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)").run(username, email, password_hash)

  const token = signToken({ userId: result.lastInsertRowid as number, username })

  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, username, email },
  })
})

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ error: "Faltan campos: username, password" })
    return
  }

  const db = getDb()
  const user = db.prepare("SELECT id, username, email, password_hash FROM users WHERE username = ?").get(username) as any

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: "Credenciales inválidas" })
    return
  }

  const token = signToken({ userId: user.id, username: user.username })

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  })
})

router.get("/me", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()
  const record = db.prepare("SELECT id, username, email, created_at FROM users WHERE id = ?").get(user.userId) as any

  if (!record) {
    res.status(404).json({ error: "Usuario no encontrado" })
    return
  }

  res.json({ user: record })
})

export default router
