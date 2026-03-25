const db = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const [[movies]] = await db.query('SELECT COUNT(*) AS count FROM movies');
        const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users');
        const [[types]] = await db.query('SELECT COUNT(*) AS count FROM movie_types');

        res.render('admin', {
            activePage: 'dashboard',
            totalMovies: movies.count,
            totalUsers: users.count,
            totalTypes: types.count
        });

    } catch (err) {
        console.error(err);
        res.send('Dashboard error');
    }
};