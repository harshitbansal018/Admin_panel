const db = require('../../config/db');
const movieModel = require('../../model/admin/movieModel');
const movieTypeModel = require('../../model/admin/movieTypeModel');
const movieController = {
    //  GET all movies
  getMovies: async (req, res) => {
    try {
        const user = req.session.user;

        if (!user) {
            return res.redirect('/admin/login');
        }

        let movies;

        if (user.role === "admin") {
            movies = await movieModel.getAllMovies();
        } else if (user.role === "publisher") {
            movies = await movieModel.getMoviesByPublisher(user.id);
        }

        res.render('admin/admin', {
            activePage: 'movies',
            movies: movies,
            user: user
        });

    } catch (err) {
        console.error(err);
        res.send('Error fetching movies');
    }
},
deleteMovie: async (req, res) => {
    const id = req.params.id;

    try {
        const user = req.session.user;

        if (!user) {
            return res.redirect('/admin/login');
        }

        // 🧠 Step 1: Get movie
        const movie = await movieModel.getMovieById(id);

        if (!movie) {
            return res.send('Movie not found');
        }

        // 🚨 ROLE CHECK
        if (user.role === "publisher" && movie.publisher_id !== user.id) {
            return res.send("Access Denied: You can only delete your own movies");
        }

        // 🗑️ Step 2: Delete movie
        await movieModel.deleteMovie(id);

        // 🔍 Step 3: Check remaining movies of same type
        const remainingMovies = await movieModel.countMoviesByType(movie.type_id);

        // ❗ Step 4: Delete type if no movies left
        if (remainingMovies === 0) {
            await movieTypeModel.deleteType(movie.type_id);
        }

        res.redirect('/admin/movies');

    } catch (err) {
        console.error(err);
        res.send('Error deleting movie');
    }
}};
module.exports = movieController;