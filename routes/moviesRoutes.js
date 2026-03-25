const express = require('express');
const router = express.Router();

const movieController = require('../controllers/moviesController');

// 🎬 Movies list route
router.get('/movies', movieController.getMovies);

module.exports = router;