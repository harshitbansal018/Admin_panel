const db = require('../../config/db');
const movieModel = require('../../model/admin/movieModel');
const movieTypeModel = require('../../model/admin/movieTypeModel');

const movieController = {

  // 🎬 GET all movies
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
        movies,
        user
      });

    } catch (err) {
      console.error(err);
      res.send('Error fetching movies');
    }
  },

  // 🗑️ Delete movie
  deleteMovie: async (req, res) => {
    const id = req.params.id;

    try {
      const user = req.session.user;

      if (!user) {
        return res.redirect('/admin/login');
      }

      const movie = await movieModel.getMovieById(id);

      if (!movie) {
        return res.send('Movie not found');
      }

      // 🚨 ROLE CHECK
      if (user.role === "publisher" && movie.publisher_id !== user.id) {
        return res.send("Access Denied");
      }

      await movieModel.deleteMovie(id);

      const remainingMovies = await movieModel.countMoviesByType(movie.type_id);

      if (remainingMovies === 0) {
        await movieTypeModel.deleteType(movie.type_id);
      }

      res.redirect('/admin/movies');

    } catch (err) {
      console.error(err);
      res.send('Error deleting movie');
    }
  },

  // 🔄 Toggle Status (🔥 FIXED)
  toggleStatus: async (req, res) => {
    try {
      const movieId = req.params.id;

      const movie = await movieModel.getMovieById(movieId); // ✅ FIXED

      if (!movie) {
        return res.send("Movie not found");
      }

      const newStatus = movie.status === 'active' ? 'inactive' : 'active';

      await movieModel.updateStatus(movieId, newStatus); // ✅ FIXED

      res.redirect('/admin/movies');

    } catch (err) {
      console.error(err);
      res.send("Error updating status");
    }
  }

};

module.exports = movieController;