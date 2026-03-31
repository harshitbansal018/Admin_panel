const db = require("../../config/db");

// 🔍 Find publisher by email
exports.findPublisherByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND role = 'publisher' LIMIT 1",
    [email]
  );
  return rows[0];
};

// ➕ Create publisher (stored in users table)
exports.createPublisher = async (name, email, password) => {
  await db.query(
    "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, "publisher", 1]
  );
};