const db = require('../../config/db');

exports.getCounts = async () => {
    const [[movies]] = await db.query('SELECT COUNT(*) AS count FROM movies');
    const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users');
    const [[types]] = await db.query('SELECT COUNT(*) AS count FROM movie_types');

    return {
        totalMovies: movies.count,
        totalUsers: users.count,
        totalTypes: types.count
    };
};