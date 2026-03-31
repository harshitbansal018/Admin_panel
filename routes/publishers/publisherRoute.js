const express = require("express");
const router = express.Router();

const { isAuth, isPublisher } = require("../../middleware/auth"); 
const publisherController = require("../../controllers/publishers/publisherController");
const dashboardController = require("../../controllers/publishers/dashboardController");

// ==========================
// 📊 DASHBOARD (PROTECTED)
// ==========================
router.get("/dashboard", isAuth, isPublisher, dashboardController.getDashboard);

// ==========================
// 🚪 LOGOUT (PROTECTED)
// ==========================
router.get("/logout", isAuth, publisherController.logout);

// ==========================
// 🔄 SESSION CHECK
// ==========================
router.get("/check-session", (req, res) => {
  if (req.session?.user && req.session.user.role === "publisher") {
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

module.exports = router;