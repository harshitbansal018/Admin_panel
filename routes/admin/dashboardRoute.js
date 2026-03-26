const express = require('express');
const router = express.Router();

const { isAuth } = require('../../middleware/auth'); // ✅ import
const dashboardController = require('../../controllers/admin/dashboardController');

router.get('/dashboard', isAuth, dashboardController.getDashboard);


module.exports = router;