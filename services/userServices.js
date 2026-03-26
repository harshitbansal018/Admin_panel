const db = require('../config/db');

exports.getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

exports.createUser = async (user) => {
  const { email, password, name } = user;

  await db.query(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
    [email, password, name]
  );
};