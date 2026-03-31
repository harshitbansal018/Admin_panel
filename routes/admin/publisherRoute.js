const express = require('express');
const router = express.Router();

const { isAuth, isAdmin } = require('../../middleware/auth');
const publisherController = require('../../controllers/admin/publisherController');

// 📄 Publisher list (ADMIN ONLY)
router.get('/publishers', isAuth, isAdmin, publisherController.getPublishers);

module.exports = router;