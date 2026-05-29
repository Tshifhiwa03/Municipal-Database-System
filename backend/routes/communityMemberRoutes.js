const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../database");

// REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const { full_name, email, password, phone_number } = req.body;

        if (!full_name || !email || !password || !phone_number) {
            return res.status(400).json({ error: "All fields required" });
        }

        // 🔐 HASH PASSWORD
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // INSERT INTO DB
        const sql = `
            INSERT INTO community_member (full_name, phone_number, email, password_hash)
            VALUES (?, ?, ?, ?)
        `;

        await pool.query(sql, [full_name, phone_number, email, hashedPassword]);

        res.json({ success: true, message: "Account created successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
  
      // Fetch user from DB
      const [rows] = await pool.query(
        "SELECT * FROM community_member WHERE email = ?",
        [email]
      );
  
      const user = rows[0];
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      res.json({
        success: true,
        message: "Login successful",
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;