const express = require('express');
const router = express.Router();
const {isPublisher} = require('../../middleware/auth');
const moviesController = require('../../controllers/publishers/moviesController');

// 🎬 Movies list
router.get('/movies', isPublisher, moviesController.getMovies);

// // ➕ Add movie
// router.get('/add-movie', isAuth, moviesController.getAddMovie);
// router.post('/add-movie', isAuth, moviesController.postAddMovie);

// // ❌ Delete movie
// router.get('/delete-movie/:id', isAuth, moviesController.deleteMovie);

module.exports = router;