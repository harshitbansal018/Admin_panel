const db = require('../config/db');

const movieTypeController = {
    // 🎬 Get all movie types
    getMovieTypes: async (req, res) => {
        try {
            const [types] = await db.query('SELECT * FROM movie_types');

            res.render('admin', {
                activePage: 'movie-types',
                types: types
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching movie types');
        }
    },

    // ➕ Show Add Movie Type Page
    getAddMovieType: (req, res) => {
        res.render('admin', {
            activePage: 'add-movie-type'
        });
    },

    // ➕ Insert Movie Type
    postAddMovieType: async (req, res) => {
        const { name, status } = req.body;

        try {
            if (!name) {
                return res.send('Name is required');
            }

            await db.query(
                'INSERT INTO movie_types (name, status) VALUES (?, ?)',
                [name, status || 'active']
            );

            res.redirect('/admin/movie-types');

        } catch (err) {
            console.error(err);
            res.send('Error adding movie type');
        }
    },

    // 🔄 Toggle Status (Active / Inactive)
    toggleStatus: async (req, res) => {
        const id = req.params.id;

        try {
            const [rows] = await db.query(
                'SELECT status FROM movie_types WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.send('Type not found');
            }

            const newStatus = rows[0].status === 'active' ? 'inactive' : 'active';

            await db.query(
                'UPDATE movie_types SET status = ? WHERE id = ?',
                [newStatus, id]
            );

            res.redirect('/admin/movie-types');

        } catch (err) {
            console.error(err);
            res.send('Error updating status');
        }
    }

};

module.exports = movieTypeController;