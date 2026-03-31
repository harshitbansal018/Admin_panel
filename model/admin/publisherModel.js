const db = require('../../config/db');

exports.getAllPublishers = async () => {
    const [rows] = await db.query(`
        SELECT 
            u.id,
            u.name,
            u.email,
            u.is_active,
            COUNT(m.id) AS total_movies
        FROM users u
        LEFT JOIN movies m 
            ON u.id = m.publisher_id
        WHERE u.role = 'publisher'
        GROUP BY u.id
        ORDER BY u.id DESC
    `);

    return rows;
};