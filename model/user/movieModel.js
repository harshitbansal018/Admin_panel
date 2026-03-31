const db = require('../../config/db');

// 🎬 Get Movies with filters
exports.getFilteredMovies = async (type, publisher) => {
    let query = `
        SELECT 
            m.*,
            mt.type_name,
            u.name AS publisher_name
        FROM movies m
        LEFT JOIN movie_types mt ON m.type_id = mt.id
        LEFT JOIN users u ON m.publisher_id = u.id
        WHERE m.status = 'active'
    `;

    let params = [];

    if (type) {
        query += " AND m.type_id = ?";
        params.push(type);
    }

    if (publisher) {
        query += " AND m.publisher_id = ?";
        params.push(publisher);
    }

    const [rows] = await db.query(query, params);
    return rows;
};

// 📊 Get all types
exports.getAllTypes = async () => {
    const [rows] = await db.query("SELECT * FROM movie_types");
    return rows;
};

// 👤 Get all publishers
exports.getAllPublishers = async () => {
    const [rows] = await db.query(
        "SELECT id, name FROM users WHERE role = 'publisher'"
    );
    return rows;
};