import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth"
import sessionsRoutes from "./routes/sessions"
import projectsRoutes from "./routes/projects"
import { proxyToOpencode } from "./proxy"

const app = express()
const PORT = parseInt(process.env.BACKEND_PORT || "4098", 10)

app.use(cors())
app.use(express.json({ limit: "10mb" }))

app.use("/api/auth", authRoutes)
app.use("/api/sessions", sessionsRoutes)
app.use("/api/projects", projectsRoutes)

app.all("/api/*", proxyToOpencode)

app.listen(PORT, () => {
  console.log(`[AgileDev Backend] Running on port ${PORT}`)
})
