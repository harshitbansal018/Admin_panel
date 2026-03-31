const express = require('express');
const router = express.Router();

const { isAuth, isAdmin,isPublisher } = require('../../middleware/auth');
const userController = require('../../controllers/admin/userController');


// ==========================
// 🔐 AUTH ROUTES (PUBLIC)
// ==========================

// 🔥 Prevent logged-in users from accessing login
router.get('/login', (req, res, next) => {
  if (req.session?.user) {
    return res.redirect('/');
  }
  next();
}, userController.getLogin);

router.post('/login', userController.postLogin);

// 🔥 Prevent logged-in users from accessing signup
router.get('/signup', (req, res, next) => {
  if (req.session?.user) {
    return res.redirect('/');
  }
  next();
}, userController.getSignup);

router.post('/signup', userController.postSignup);


// ==========================
// 👥 ADMIN ROUTES
// ==========================

// 📄 User List
router.get('/users', isAuth, isAdmin, userController.getUsers);

// 🔄 Toggle User Status
router.post('/toggle-user-status/:id', isAuth, isAdmin, userController.toggleUserStatus);


// ==========================
// 🔍 SESSION CHECK
// ==========================

router.get('/check-session', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).send("Session expired");
  }
  res.sendStatus(200);
});


// ==========================
// 🚪 LOGOUT (FIXED 🔥)
// ==========================

router.get('/logout', isAuth, (req, res) => {
  const role = req.session.user?.role;

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.redirect('/');
    }

    res.clearCookie('session_id');
    res.set('Cache-Control', 'no-store');

    // 🔥 Redirect based on role
    if (role === "publisher") {
      return res.redirect('/publisher/login');
    } else {
      return res.redirect('/admin/login'); // admin + user
    }
  });
});


module.exports = router;