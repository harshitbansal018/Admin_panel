const express = require('express');
const router = express.Router();

const { isAuth } = require('../../middleware/auth');
const userController = require('../../controllers/admin/userController');

// 🔐 Login Routes (NO auth here)
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

// 📝 Signup Routes (NO auth)
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// 📄 User List (PROTECTED ✅)
router.get('/users', isAuth, userController.getUsers);
router.get('/check-session', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send("Session expired");
  }

  res.status(200).send("Active");
});

// 🔄 Toggle User Status (ADD THIS ✅)
router.post('/toggle-user-status/:id', isAuth, userController.toggleUserStatus);

// 🚪 Logout
router.get('/logout', isAuth, userController.logout);

module.exports = router;