const db = require('../../config/db');

// 📥 Get movies for specific publisher
exports.getMoviesByPublisher = async (publisherId) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM movies WHERE publisher_id = ? ORDER BY created_at DESC",
            [publisherId]
        );

        return rows;

    } catch (err) {
        throw err;
    }
};


// ➕ Add new movie
exports.addMovie = async (movieData) => {
    const { title, theme, publish_date, expire_date, type_id, publisher_id } = movieData;

    try {
        await db.query(
            `INSERT INTO movies 
            (title, theme, publish_date, expire_date, type_id, status, publisher_id, created_at)
            VALUES (?, ?, ?, ?, ?, 'active', ?, NOW())`,
            [title, theme, publish_date, expire_date, type_id, publisher_id]
        );

    } catch (err) {
        throw err;
    }
};


// ❌ Delete movie
exports.deleteMovie = async (id, publisherId) => {
    try {
        await db.query(
            "DELETE FROM movies WHERE id = ? AND publisher_id = ?",
            [id, publisherId]
        );

    } catch (err) {
        throw err;
    }
};