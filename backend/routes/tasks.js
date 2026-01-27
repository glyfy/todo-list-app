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
        let  { user_id, title, startdate, due_at, completed_at } = req.body
        // sanitize strings
        startdate = startdate || null
        due_at = due_at || null
        completed_at = completed_at || null
        // make db insert query
        const result = await pool.query(
        `
        insert into public.tasks (user_id, title, startdate, due_at, completed_at)
        values ($1, $2, $3, $4, $5)
        returning *
        `, [user_id, title, startdate, due_at, completed_at])
        const task = result.rows[0]
        return res.status(201).json({...task})

    } catch(error) {
        // res status 500
        return res.status(500).json({error:"Internal server error"})
    }
})

module.exports = router