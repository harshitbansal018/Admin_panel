const express = require('express');
const router = express.Router();

const { isAuth, isAdmin } = require('../../middleware/auth');
const userController = require('../../controllers/admin/userController');

// 🔐 Login Routes (NO auth)
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

// 📝 Signup Routes (NO auth)
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// 📄 User List (ADMIN ONLY ✅)
router.get('/users', isAdmin, userController.getUsers);

// 🔍 Check session (UPDATED ✅)
router.get('/check-session', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send("Session expired");
  }

  res.status(200).send("Active");
});

// 🔄 Toggle User Status (ADMIN ONLY ✅)
router.post('/toggle-user-status/:id', isAdmin, userController.toggleUserStatus);

// 🚪 Logout (ANY LOGGED USER)
router.get('/logout', isAuth, userController.logout);

module.exports = router;