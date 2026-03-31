const moviesModel = require('../../model/publishers/moviesModel');

const moviesController = {

    // 🎬 Show Publisher Movies
    getMovies: async (req, res) => {
        try {
            const user = req.session.user;

            if (!user) {
                return res.redirect('/admin/login');
            }

            const publisherId = user.id;

            const movies = await moviesModel.getMoviesByPublisher(publisherId);

            res.render('publishers/admin', {
                activePage: 'movies',
                movies,
                user
            });

        } catch (err) {
            console.error(err);
            res.send("Error loading movies");
        }
    },

    // ➕ Show Add Movie Page
    getAddMovie: (req, res) => {
        try {
            if (!req.session?.user) {
                return res.redirect('/admin/login');
            }

            res.render('publishers/admin', {
                activePage: 'add-movie',
                user: req.session.user
            });

        } catch (err) {
            console.error(err);
            res.send("Error loading add movie page");
        }
    },

    // ➕ Handle Add Movie
    addMovie: async (req, res) => {
    try {
        const user = req.session.user;

        if (!user || user.role !== "publisher") {
            return res.redirect('/admin/login');
        }

        const publisherId = user.id;

        const { title, theme, publish_date, expire_date, type_id } = req.body;

        // 🔥 NEW LINE (MULTER)
  const image = req.file ? req.file.filename : null;

        // 🚨 Validation
        if (!title || !theme || !publish_date || !expire_date || !type_id) {
            return res.send("All fields are required");
        }

        await moviesModel.addMovie({
            title,
            theme,
            publish_date,
            expire_date,
            type_id,
            publisher_id: publisherId,
            image // ✅ NEW
        });

        res.redirect('/publisher/movies');

    } catch (err) {
        console.error(err);
        res.send("Error adding movie");
    }
},

    // ❌ Delete Movie (only own movie)
    deleteMovie: async (req, res) => {
        try {
            const user = req.session.user;

            if (!user || user.role !== "publisher") {
                return res.redirect('/admin/login');
            }

            const publisherId = user.id;
            const movieId = req.params.id;

            await moviesModel.deleteMovie(movieId, publisherId);

            res.redirect('/publisher/movies');

        } catch (err) {
            console.error(err);
            res.send("Error deleting movie");
        }
    }

};

module.exports = moviesController;