const express = require('express');
const router = express.Router();

const movieController = require('../../controllers/admin/moviesController');
const { isAuth, isAdmin } = require('../../middleware/auth');

// 🎬 Movies list (Admin + Publisher)
router.get('/movies', isAuth, movieController.getMovies);
router.get(
  '/toggle-status/:id',
  isAuth,
  isAdmin,
  movieController.toggleStatus
);

// 🗑️ Delete movie (role logic inside controller)
router.post('/delete-movie/:id', isAuth, movieController.deleteMovie);


module.exports = router;