const bcrypt = require("bcrypt");
const userModel = require("../../model/admin/userModel");

const publisherController = {

  // 🔐 Show Login
  getLogin: (req, res) => {
    res.render("publishers/login", { error: null, success: null });
  },

  // 🔐 Handle Login (ONLY PUBLISHER)
  postLogin: async (req, res) => {
    try {
      let { email, password } = req.body;

      email = email?.trim().toLowerCase();
      password = password?.trim();

      if (!email || !password) {
        return res.render("publishers/login", {
          error: "All fields are required",
          success: null,
        });
      }

      const user = await userModel.findByEmail(email);

      // ❌ Not found OR not publisher
      if (!user || user.role !== "publisher") {
        return res.render("publishers/login", {
          error: "Publisher not found",
          success: null,
        });
      }

      // 🚫 inactive check
      if (!user.is_active) {
        return res.render("publishers/login", {
          error: "Account inactive",
          success: null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("publishers/login", {
          error: "Invalid password",
          success: null,
        });
      }

      // ✅ SINGLE SESSION SYSTEM
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return res.redirect("/publisher/dashboard");

    } catch (err) {
      console.error("Publisher Login Error:", err);
      return res.render("publishers/login", {
        error: "Login failed",
        success: null,
      });
    }
  },

  // 📝 Signup
  getSignup: (req, res) => {
    res.render("publishers/signup", { error: null, success: null });
  },

  postSignup: async (req, res) => {
    try {
      let { name, email, password } = req.body;

      name = name?.trim();
      email = email?.trim().toLowerCase();
      password = password?.trim();

      if (!name || !email || !password) {
        return res.render("publishers/signup", {
          error: "All fields are required",
          success: null,
        });
      }

      const existingUser = await userModel.findByEmail(email);

      if (existingUser) {
        return res.render("publishers/signup", {
          error: "Email already exists",
          success: null,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create as publisher
      await userModel.createUser(name, email, hashedPassword, "publisher");

      return res.render("publishers/login", {
        error: null,
        success: "Signup successful! Please login.",
      });

    } catch (err) {
      console.error("Publisher Signup Error:", err);
      return res.render("publishers/signup", {
        error: "Signup failed",
        success: null,
      });
    }
  },

  // 🚪 Logout
  logout: (req, res) => {
    req.session.destroy();   // ✅ destroy full session
    return res.redirect("/publisher/login");
  },
};

module.exports = publisherController;