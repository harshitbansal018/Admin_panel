const db = require('../config/db');

const movieController = {

    // 🎬 GET all movies
    getMovies: async (req, res) => {
        try {
            const [movies] = await db.query(`
                SELECT m.*, mt.type_name AS movie_type
                FROM movies m
                LEFT JOIN movie_types mt ON m.type_id = mt.id
            `);

            res.render('admin', {
                activePage: 'movies',
                movies: movies
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching movies');
        }
    }

};

module.exports = movieController;