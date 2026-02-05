require("dotenv").config();
const express = require("express");
const pool = require("./db");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
const requireAuth = require("./middleware/requireAuth");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/health/db", async (req, res) => {
  try {
    console.log(process.env.DATABASE_URL);
    const result = await pool.query("select now() as server_time;");
    res.json({ db: "ok", time: result.rows[0].server_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "error" });
  }
});

app.get("/me", async (req, res) => {
  const user_id = req.userId;
  try {
    // try and find user
    const result = await pool.query(
      `
        select id, name, email from users where id = $1   
        `,
      [user_id],
    );
    if (result.rowCount == 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const { id, name, email } = result.rows[0];
    return res.status(200).json({ id: id, name: name, email: email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/auth", authRouter);
app.use("/tasks", requireAuth, tasksRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
