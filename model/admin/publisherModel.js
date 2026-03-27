const db = require('../../config/db');

exports.getAllPublishers = async () => {
    const [publishers] = await db.query(`
        SELECT 
            p.id,
            p.name,
            p.created_at,
            p.email,
            COUNT(m.id) AS total_movies
        FROM publishers p
        LEFT JOIN movies m 
            ON p.id = m.publisher_id   -- ✅ USE THIS
        GROUP BY p.id
    `);

    return publishers;
};