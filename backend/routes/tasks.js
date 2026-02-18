const { validate: isUUID } = require("uuid");
const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // call the db
    const result = await pool.query(
      `
        select * from public.tasks where user_id = $1 
        `,
      [req.user_id],
    );
    return res.json({ tasks: result.rows });
    // return tasks
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const toTrimmedOrNull = (v) => {
      if (typeof v !== "string") return null;
      const t = v.trim();
      return t.length ? t : null;
    };

    let { title, startdate, deadline } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    title = title.trim();

    startdate = toTrimmedOrNull(startdate);
    deadline = toTrimmedOrNull(deadline); // optional

    // Validate date strings if provided
    const startTs = startdate ? new Date(startdate).getTime() : null;
    const dueTs = deadline ? new Date(deadline).getTime() : null;

    if (startdate && Number.isNaN(startTs)) {
      return res.status(400).json({ error: "Invalid startdate format" });
    }
    if (deadline && Number.isNaN(dueTs)) {
      return res.status(400).json({ error: "Invalid deadline format" });
    }

    // Ensure deadline > startdate when both exist
    if (startTs !== null && dueTs !== null && dueTs <= startTs) {
      return res
        .status(400)
        .json({ error: "Deadline must be later than start date" });
    }

    // Single insert: pass null when optional fields not provided
    const result = await pool.query(
      `
      insert into public.tasks (user_id, title, startdate, deadline, completed_at)
      values ($1, $2, $3, $4, $5)
      returning id, user_id, title, startdate, deadline, completed_at
      `,
      [req.user_id, title, startdate, deadline, null],
    );

    return res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id: task_id } = req.params;
    const toTrimmedOrNull = (v) => {
      if (typeof v !== "string") return null;
      const t = v.trim();
      return t.length ? t : null;
    };

    let { title, startdate, deadline } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    title = title.trim();

    startdate = toTrimmedOrNull(startdate);
    deadline = toTrimmedOrNull(deadline); // optional

    // Validate date strings if provided
    const startTs = startdate ? new Date(startdate).getTime() : null;
    const dueTs = deadline ? new Date(deadline).getTime() : null;

    if (startdate && Number.isNaN(startTs)) {
      return res.status(400).json({ error: "Invalid startdate format" });
    }
    if (deadline && Number.isNaN(dueTs)) {
      return res.status(400).json({ error: "Invalid deadline format" });
    }

    // Ensure deadline > startdate when both exist
    if (startTs !== null && dueTs !== null && dueTs <= startTs) {
      return res
        .status(400)
        .json({ error: "Deadline must be later than start date" });
    }

    // send update query to db
    const result = await pool.query(
      `
      UPDATE tasks
      SET
        startdate = $1,
        deadline = $2,
        title = $3
      WHERE id = $4
      returning id, user_id, title, startdate, deadline, completed_at;
      `,
      [startdate, deadline, title, task_id],
    );
    return res.status(200).json({ task: result.rows[0] });

    // return status 200 and updated task
  } catch (error) {
    // status 500
    console.error(error);
    return res.status(500).json("Internal server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // get param
    const { id: task_id } = req.params;
    if (!isUUID(task_id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }
    // sql query to delete task (check with taskid and userid)
    const result = await pool.query(
      `
        delete from public.tasks
        where id = $1 and user_id = $2
        returning id
        `,
      [task_id, req.user_id],
    );
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ task: result.rows });
  } catch (error) {
    console.error(error);
    // internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
