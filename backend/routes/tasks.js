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

module.exports = router