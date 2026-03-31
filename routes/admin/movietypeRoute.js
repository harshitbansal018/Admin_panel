const express = require('express');
const router = express.Router();
const { isAuth } = require('../../middleware/auth');
const movieController = require('../../controllers/admin/movietypeController');

// Get all movie types
router.get('/movie-types', isAuth, movieController.getMovieTypes);

// Add movie type (FIXED)
router.post('/movie-types/add', isAuth, movieController.addMovieType);

module.exports = router;