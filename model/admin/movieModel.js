const db = require('../../config/db');
exports.getAllMovies = async () => {
    try {
        const [movies] = await db.query(`
            SELECT m.*, mt.type_name AS movie_type
            FROM movies m
            LEFT JOIN movie_types mt ON m.type_id = mt.id
            ORDER BY m.id DESC
        `);

        return movies;

    } catch (err) {
        console.error('Error in getAllMovies:', err);
        throw err;
    }
                            
};
exports.deleteMovie = async (id) => {
    return await db.query(
        'DELETE FROM movies WHERE id = ?',
        [id]
    );
};
// Get movie by ID
exports.getMovieById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM movies WHERE id = ?",
        [id]
    );
    return rows[0];
};

// Count movies by type
exports.countMoviesByType = async (typeId) => {
    const [rows] = await db.query(
        "SELECT COUNT(*) as count FROM movies WHERE type_id = ?",
        [typeId]
    );
    return rows[0].count;
};
