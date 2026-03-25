const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movietypeController');

// 🎬 Movie types list route
router.get('/movie-types', movieController.getMovieTypes);

module.exports = router;