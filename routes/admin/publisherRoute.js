const express = require('express');
const router = express.Router();
const { isAuth } = require('../../middleware/auth');
const publisherController = require('../../controllers/admin/publisherController');

// 🎬 Publisher list route
router.get('/publishers',isAuth, publisherController.getPublishers);

module.exports = router;