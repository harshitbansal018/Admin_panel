const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/publishers/dashboardController');

// middleware (important)
// const isPublisher = (req, res, next) => {
//     if (req.session.user && req.session.user.role === 'publisher') {
//         next();
//     } else {
//         res.redirect('/publisher/login');
//     }
// };

router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;