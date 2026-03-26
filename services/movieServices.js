const db = require('../config/db');

exports.addMovie = async (movieData) => {
  const {
    title,
    type_id,
    theme,
    expire_date,
    publish_date,
    status,
    publisher_id
  } = movieData;

  await db.query(
    `INSERT INTO movies 
    (title, type_id, theme, expire_date, publish_date, status, publisher_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, type_id, theme, expire_date, publish_date, status, publisher_id]
  );
};

exports.getAllMovies = async () => {
  const [movies] = await db.query(`
    SELECT 
      m.*, 
      p.name AS publisher_name,
      t.type_name
    FROM movies m
    LEFT JOIN publishers p ON m.publisher_id = p.id
    LEFT JOIN movie_types t ON m.type_id = t.id
  `);

  return movies;
};