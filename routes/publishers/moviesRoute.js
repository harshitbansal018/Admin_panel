const express = require('express');
const router = express.Router();

const upload = require('../../middleware/upload');
const { isAuth, isPublisher } = require('../../middleware/auth');
const moviesController = require('../../controllers/publishers/moviesController');

// 🎬 Movies list
router.get('/movies', isAuth, isPublisher, moviesController.getMovies);

// ➕ Show Add Movie Page (🔥 FIX ADDED)
router.get('/add-movie', isAuth, isPublisher, moviesController.getAddMovie);

// ➕ Handle Add Movie
router.post(
  '/add-movie',
  isAuth,
  isPublisher,
  upload.single('image'),
  moviesController.addMovie
);

// ❌ Delete Movie
router.get('/delete/:id', isAuth, isPublisher, moviesController.deleteMovie);

module.exports = router;