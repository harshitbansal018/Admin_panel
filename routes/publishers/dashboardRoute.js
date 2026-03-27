const express = require('express');
const router = express.Router();
const {isPublisher} = require('../../middleware/auth');
const dashboardController = require('../../controllers/publishers/dashboardController');



router.get('/dashboard', isPublisher, dashboardController.getDashboard);

module.exports = router;