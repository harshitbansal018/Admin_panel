const express = require('express');
const router = express.Router();

const movieController = require('../../controllers/admin/moviesController');
const { isAuth } = require('../../middleware/auth');

// 🎬 Movies list route
router.get('/movies',isAuth, movieController.getMovies);
router.post('/delete-movie/:id', isAuth, movieController.deleteMovie);// ✅ add delete route



module.exports = router;