const express = require('express');
const router = express.Router();

const { isAuth, isPublisher } = require('../../middleware/auth');
const dashboardController = require('../../controllers/publishers/dashboardController');

// 📊 Publisher Dashboard
router.get('/dashboard', isAuth, isPublisher, dashboardController.getDashboard);

module.exports = router;