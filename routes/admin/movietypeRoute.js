const express = require('express');
const router = express.Router();
const { isAuth } = require('../../middleware/auth');
const movieController = require('../../controllers/admin/movietypeController');

// 🎬 Movie types list route
router.get('/movie-types',isAuth, movieController.getMovieTypes);


module.exports = router;