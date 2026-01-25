require("dotenv").config()
const express = require("express")
const pool = require('./db')
const tasksRouter = require("./routes/tasks")
const authRouter = require("./routes/auth")
const requireAuth = require("./middleware/requireAuth")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello from Express")
})

app.get("/health", (req, res) => {
    res.json({ok: true})
})

app.get("/health/db", async (req, res) => {
    try {
        console.log(process.env.DATABASE_URL)
        const result = await pool.query("select now() as server_time;");
        res.json({db: "ok", time: result.rows[0].server_time })
    } catch(err) {
        console.error(err)
        res.status(500).json({ db : "error" })
    }
})

app.use("/auth", authRouter)
app.use("/tasks", requireAuth, tasksRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})