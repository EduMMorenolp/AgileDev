import { Router, Request, Response } from "express"
import { getDb } from "../db"
import { authMiddleware } from "../middleware/auth"

const router = Router()
router.use(authMiddleware)

router.get("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const projects = db
    .prepare(
      `SELECT id, slug, name, status, created_at, updated_at
       FROM projects
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
    .all(user.userId)

  res.json({ projects })
})

router.post("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const { slug, name } = req.body

  if (!slug || !name) {
    res.status(400).json({ error: "slug y name son requeridos" })
    return
  }

  const db = getDb()

  const existing = db
    .prepare("SELECT id FROM projects WHERE slug = ? AND user_id = ?")
    .get(slug, user.userId) as any

  if (existing) {
    db.prepare("UPDATE projects SET name = ?, updated_at = datetime('now') WHERE id = ?").run(name, existing.id)
    res.json({ id: existing.id })
  } else {
    const result = db
      .prepare("INSERT INTO projects (user_id, slug, name) VALUES (?, ?, ?)")
      .run(user.userId, slug, name)

    res.status(201).json({ id: result.lastInsertRowid })
  }
})

router.patch("/:slug", (req: Request, res: Response) => {
  const user = (req as any).user
  const { status } = req.body

  if (!status || !["incomplete", "complete"].includes(status)) {
    res.status(400).json({ error: "status debe ser 'incomplete' o 'complete'" })
    return
  }

  const db = getDb()

  const result = db
    .prepare("UPDATE projects SET status = ?, updated_at = datetime('now') WHERE slug = ? AND user_id = ?")
    .run(status, req.params.slug, user.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: "Proyecto no encontrado" })
    return
  }

  res.json({ success: true })
})

export default router
