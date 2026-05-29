// test.js
const pool = require('./database');

async function testConnection() {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM community_member');
    console.log(rows);
  } catch (err) {
    console.error('DB Error:', err);
  }
}

testConnection();