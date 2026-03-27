const db = require('../../config/db');
const movieModel = require('../../model/admin/movieModel');
const movieTypeModel = require('../../model/admin/movieTypeModel');
const movieController = {
    //  GET all movies
    getMovies: async (req, res) => {
        try {
          
            const movies = await movieModel.getAllMovies();
            res.render('admin/admin', {
                activePage: 'movies',
                movies: movies
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching movies');
        }
    },
deleteMovie: async (req, res) => {
    const id = req.params.id;

    try {
        // 🧠 Step 1: Get movie first (to know its type_id)
        const movie = await movieModel.getMovieById(id);

        if (!movie) {
            return res.send('Movie not found');
        }

        const typeId = movie.type_id;

        // 🗑️ Step 2: Delete movie
        await movieModel.deleteMovie(id);

        // 🔍 Step 3: Check if any movies left with same type
        const remainingMovies = await movieModel.countMoviesByType(typeId);

        // ❗ Step 4: If no movies left → delete type
        if (remainingMovies === 0) {
            await movieTypeModel.deleteType(typeId);
        }

        res.redirect('/admin/movies');

    } catch (err) {
        console.error(err);
        res.send('Error deleting movie');
    }
}
};
module.exports = movieController;