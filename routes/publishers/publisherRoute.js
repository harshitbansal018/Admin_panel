const express = require("express");
const router = express.Router();

const publisherController = require("../../controllers/publishers/publisherController");
const dashboardController = require("../../controllers/publishers/dashboardController");

// 🔐 Middleware: Check Publisher Login
const isPublisher = (req, res, next) => {
if (req.session.user && req.session.user.role === "publisher") {
next();
} else {
return res.redirect("/publisher/login");
}
};

// ==========================
// 🔐 AUTH ROUTES
// ==========================

// Login
router.get("/login", publisherController.getLogin);
router.post("/login", publisherController.postLogin);

// Signup
router.get("/signup", publisherController.getSignup);
router.post("/signup", publisherController.postSignup);

// Logout
router.get("/logout", publisherController.logout);

// ==========================
// 📊 DASHBOARD ROUTE
// ==========================

router.get("/dashboard", isPublisher, dashboardController.getDashboard);

// ==========================
// 🔄 SESSION CHECK (for auto logout)
// ==========================

router.get("/check-session", (req, res) => {
if (req.session.user && req.session.user.role === "publisher") {
res.sendStatus(200);
} else {
res.sendStatus(401);
}
});

module.exports = router;
