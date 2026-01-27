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

module.exports = router