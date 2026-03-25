const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController'); // ✅ ADD THIS

// 🔐 Login Routes
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

// 📝 Signup Routes
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// 📄 User List
router.get('/users', userController.getUsers);

// 🚪 Logout
router.get('/logout', userController.logout);

// 📊 Dashboard (Protected + FIXED)
router.get('/dashboard', (req, res, next) => {
    // 🔐 Check login
    if (!req.session.user) {
        return res.redirect('/admin/login');
    }

    next(); // go to controller
}, dashboardController.getDashboard); // ✅ USE CONTROLLER

module.exports = router;