const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    // get the name, email and password
    const { name, email, password } = req.body;
    // if missing any data, throw status 400
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Need name, email and password" });
    }
    // if password too short, throw status 400
    if (password.length < 8) {
      return res.status(400).json({ error: "Password needs to be longer" });
    }
    // encrypt the password with bcrypt
    const hashed_password = await bcrypt.hash(password, 10);

    // insert into db using string + list of variables
    const result = await pool.query(
      `insert into public.users (email, password, name)
            values ($1, $2, $3)
            returning id, email, name, created_at;            
            `,
      [email.toLowerCase(), hashed_password, name],
    );
    // return status 201 with the newly added user
    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    // return status code and useful info to frontend about error
    if (error.code == "23505") {
      return res.status(409).json({ error: "Email already exists in DB" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // deconstruct the req.body
    const { email, password } = req.body;
    // validate login details to make sure not empty
    if (!email || !password) {
      return res.status(400).json({ error: "Need email and password" });
    }
    // query db with a select using email
    const result = await pool.query(
      `select id, name, email, password, created_at from public.users
            where email=$1 
            `,
      [email],
    );
    // if length of rows is 0
    if (result.rows.length == 0) {
      // return error user does not exist
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    // compare password with hashed password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // issue json webtoken
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "7d" },
    );
    // set http only cookie
    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // return status200 and user json
    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error(error);
    // internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ ok: true });
});

module.exports = router;
