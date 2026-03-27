const express = require('express');
const router = express.Router();

const moviesController = require('../../controllers/publishers/moviesController');
const { isAuth } = require('../../middleware/auth');

// 🎬 Movies list
router.get('/movies', isAuth, moviesController.getMovies);

// // ➕ Add movie
// router.get('/add-movie', isAuth, moviesController.getAddMovie);
// router.post('/add-movie', isAuth, moviesController.postAddMovie);

// // ❌ Delete movie
// router.get('/delete-movie/:id', isAuth, moviesController.deleteMovie);

module.exports = router;