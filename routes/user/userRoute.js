const express = require('express');
const router = express.Router();

const homeController = require('../../controllers/user/homeController');

// 🏠 Home page
router.get('/home', homeController.getHome);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;