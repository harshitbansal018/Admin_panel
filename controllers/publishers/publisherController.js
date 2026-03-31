const bcrypt = require("bcrypt");
const userModel = require("../../model/admin/userModel");

const publisherController = {

  // 🔐 Show Publisher Login Page (UI ONLY)
  getLogin: (req, res) => {
    res.render("publishers/login", { error: null, success: null });
  },

  // 📝 Show Signup Page (UI ONLY)
  getSignup: (req, res) => {
    res.render("publishers/signup", { error: null, success: null });
  },

  // 🚪 Logout
  logout: (req, res) => {
    req.session.destroy();
    return res.redirect("/admin/login"); // ✅ redirect to main login
  },

};

module.exports = publisherController;

