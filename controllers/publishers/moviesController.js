const moviesModel = require('../../model/publishers/moviesModel');

const moviesController = {

    // 🎬 Show Publisher Movies
getMovies: async (req, res) => {
    try {
        if (!req.session?.user) {
            console.log("❌ SESSION MISSING");
            return res.redirect("/admin/login");
        }

        const publisherId = req.session.user.id;

        const movies = await moviesModel.getMoviesByPublisher(publisherId);

        res.render('publishers/admin', {
            activePage: 'movies',
            movies,
            user: req.session.user
        });

    } catch (err) {
        console.error(err);
        res.send("Error loading movies");
    }
}

    // // ➕ Show Add Movie Page
    // getAddMovie: (req, res) => {
    //     res.render('publishers/admin', {
    //         activePage: 'add-movie',
    //         user: req.session.user
    //     });
    // },


    // // ➕ Handle Add Movie
    // postAddMovie: async (req, res) => {
    //     try {
    //         const publisherId = req.session.user.id;

    //         const { title, theme, publish_date, expire_date, type_id } = req.body;

    //         if (!title || !theme || !publish_date || !expire_date || !type_id) {
    //             return res.send("All fields are required");
    //         }

    //         await moviesModel.addMovie({
    //             title,
    //             theme,
    //             publish_date,
    //             expire_date,
    //             type_id,
    //             publisher_id: publisherId
    //         });

    //         res.redirect('/publisher/movies');

    //     } catch (err) {
    //         console.error(err);
    //         res.send("Error adding movie");
    //     }
    // },


    // // ❌ Delete Movie
    // deleteMovie: async (req, res) => {
    //     try {
    //         const publisherId = req.session.user.id;
    //         const movieId = req.params.id;

    //         await moviesModel.deleteMovie(movieId, publisherId);

    //         res.redirect('/publisher/movies');

    //     } catch (err) {
    //         console.error(err);
    //         res.send("Error deleting movie");
    //     }
    // }

};

module.exports = moviesController;