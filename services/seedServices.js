const db = require('../config/db');
const { readJSON, writeJSON } = require('../utils/jsonHelper');

// 📤 EXPORT DB → JSON
exports.exportData = async () => {
  const [users] = await db.query("SELECT * FROM users");
  const [publishers] = await db.query("SELECT * FROM publishers");
  const [movies] = await db.query("SELECT * FROM movies");
  const [movie_types] = await db.query("SELECT * FROM movie_types");

  const data = { users, publishers, movies, movie_types };

  writeJSON('./data/data.json', data);

  console.log("✅ Data exported");
};

// 📥 IMPORT JSON → DB
exports.importData = async () => {
  const data = readJSON('./data/data.json');

  for (let p of data.publishers) {
    await db.query(
      "INSERT IGNORE INTO publishers (id, name) VALUES (?, ?)",
      [p.id, p.name]
    );
  }

  for (let t of data.movie_types) {
    await db.query(
      "INSERT IGNORE INTO movie_types (id, type_name, status) VALUES (?, ?, ?)",
      [t.id, t.type_name, t.status]
    );
  }

  for (let m of data.movies) {
    await db.query(
      `INSERT INTO movies 
      (id, title, type_id, theme, expire_date, publish_date, status, publisher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.title,
        m.type_id,
        m.theme,
        m.expire_date,
        m.publish_date,
        m.status,
        m.publisher_id
      ]
    );
  }

  console.log("✅ Data imported");
};