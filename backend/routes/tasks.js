const { validate: isUUID } = require("uuid");
const pool = require('../db')
const express = require('express')
const router = express.Router()

router.get("/", async (req, res) =>{
    try {
        // call the db
        const result = await pool.query(
        `
        select * from public.tasks where user_id = $1 
        `, [req.user.id]
        )
        return res.json({tasks: result.rows})
        // return tasks
    } catch(error) {
        return res.status(500).json({error:"Internal server error"})
    }
})

router.post("/", async (req, res) => {
    try {
        let  { title, startdate, due_at, completed_at } = req.body
        // ensure title is not empty and is string
        if (!title?.trim?.()){
            return res.status(401).json({error: "Title cannot be empty"})
        }
        title = title.trim()
        // sanitize strings
        startdate = startdate?.trim?.() || null
        due_at = due_at?.trim?.() || null
        completed_at = completed_at?.trim?.() || null
        // ensure due_at > startdate
        if (startdate &&  due_at) {
            const startTs = new Date(start_at).getTime()
            const dueTs = new Date(due_at).getTime()

            if (Number.isNaN(startTs) || Number.isNan) {
                return res.status(400).json({error:"Invalid date format"})
            }

            if (dueTs <= startTs) {
                return res.status(400).json({
                    error:"due date must be later than start date"
                })
            }
        }
        // make db insert query
        const result = await pool.query(
        `
        insert into public.tasks (user_id, title, startdate, due_at, completed_at)
        values ($1, $2, $3, $4, $5)
        returning *
        `, [req.user.id, title, startdate, due_at, completed_at])
        const task = result.rows[0]
        return res.status(201).json({ task: result.rows[0] })

    } catch(error) {
        console.error("POST /tasks error", error)
        // res status 500
        return res.status(500).json({error:"Internal server error"})
    }
})

router.patch("/:id", async (req, res) => {
    try {
        // read title, change startdate, dueat, completedat from req.body
        const {title, startdate, due_at} = req.body
        // if title is empty or not string throw error
        
        // for dates if empty or not string throw error
        // send update query to db
        // return status 200 and updated task
    } catch(error) {
        // status 500
    }
})

router.delete("/:id", async (req, res) => {
    try {
        // get param
        const {id: task_id} = req.params
        if (!isUUID(task_id)){
            return res.status(400).json({error: "Invalid task id"})
        }
        // sql query to delete task (check with taskid and userid)
        const result = await pool.query(
        `
        delete from public.tasks
        where id = $1 and user_id = $2
        returning id
        `, [task_id, req.user.id])
        if (result.rowCount == 0) {
            return res.status(404).json({error:"Task not found"})
        }
        return res.status(200).json({task: result.rows}) 
    } catch(error) {
        console.error(error);
        // internal server error
        return res.status(500).json({error:"Internal server error"})
    }
})

module.exports = router