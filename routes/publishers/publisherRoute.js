const express = require("express");
const router = express.Router();
const { isPublisher } = require("../../middleware/auth"); 
const publisherController = require("../../controllers/publishers/publisherController");
const dashboardController = require("../../controllers/publishers/dashboardController");

// ==========================
// 🔐 AUTH ROUTES
// ==========================

router.get("/login", publisherController.getLogin);
router.post("/login", publisherController.postLogin);

router.get("/signup", publisherController.getSignup);
router.post("/signup", publisherController.postSignup);

router.get("/logout", publisherController.logout);

// ==========================
// 📊 DASHBOARD
// ==========================

router.get("/dashboard", isPublisher, dashboardController.getDashboard); 

// ==========================
// 🔄 SESSION CHECK
// ==========================

router.get("/check-session", (req, res) => {
  if (req.session.publisher) {
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

module.exports = router;