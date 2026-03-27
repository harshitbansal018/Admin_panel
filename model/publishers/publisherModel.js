const db = require("../../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM publishers WHERE email = ?",
    [email]
  );
  return rows[0];
};

exports.createPublisher = async (username, email, password) => {
  await db.query(
    "INSERT INTO publishers (name, username, email, password) VALUES (?, ?, ?, ?)",
    [username, username, email, password]
  );
};