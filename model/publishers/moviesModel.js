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
exports.addMovie = async (movie) => {
    const { title, theme, publish_date, expire_date, type_id, publisher_id, image } = movie;

    return await db.query(`
        INSERT INTO movies 
        (title, theme, publish_date, expire_date, type_id, status, publisher_id, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        title,
        theme,
        publish_date,
        expire_date,
        type_id,
        'active',
        publisher_id,
        image // ✅ FIXED
    ]);
};

// ❌ Delete movie (only own movie)
exports.deleteMovie = async (movieId, publisherId) => {
    return await db.query(
        "DELETE FROM movies WHERE id = ? AND publisher_id = ?",
        [movieId, publisherId]
    );
};