const bcrypt = require("bcrypt");
const userModel = require("../../model/admin/userModel");

const userController = {
  // 🔐 Show Login Page
  getLogin: (req, res) => {
    res.render("admin/login", { error: null, success: null });
  },

  // 🔐 Handle Login
  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.render("admin/login", {
          error: "All fields are required",
          success: null,
        });
      }

      const user = await userModel.findByEmail(email);

      if (!user) {
        return res.render("admin/login", {
          error: "User not found",
          success: null,
        });
      }
      // 🚫 Block inactive users
      if (!user.is_active) {
        return res.render("admin/login", {
          error: "Your account is inactive. Contact admin.",
          success: null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("admin/login", {
          error: "Invalid password",
          success: null,
        });
      }

      // Store session
      req.session.admin = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "admin",
      };

      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error(err);
      res.render("admin/login", {
        error: "Login failed",
        success: null,
      });
    }
  },

  // 📝 Show Signup Page
  getSignup: (req, res) => {
    res.render("admin/signup", { error: null, success: null });
  },

  // 📝 Handle Signup
  postSignup: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      if (!name || !email || !password) {
        return res.render("admin/signup", {
          error: "All fields are required",
          success: null,
        });
      }

      const existingUser = await userModel.findByEmail(email);

      if (existingUser) {
        return res.render("admin/signup", {
          error: "Email already exists",
          success: null,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.createUser(name, email, hashedPassword);

      res.render("admin/login", {
        error: null,
        success: "Signup successful! Please login.",
      });
    } catch (err) {
      console.error(err);
      res.render("admin/signup", {
        error: "Signup failed",
        success: null,
      });
    }
  },

  // 👥 Get Users
  getUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();

      res.render("admin/admin", {
        // ✅ fix based on your views/admin setup
        activePage: "users",
        user: req.session.admin,
        users,
      });
    } catch (err) {
      console.error(err);
      res.send("Error fetching users");
    }
  },

  // 🚪 Logout
logout: (req, res) => {
  req.session.admin = null;   // ✅ only remove publisher session
    return res.redirect("/admin/login");
  },
  toggleUserStatus: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await userModel.getUserById(id);

      if (!user) {
        return res.send("User not found");
      }

      const newStatus = user.is_active ? 0 : 1;

      await userModel.updateUserStatus(id, newStatus);

      res.redirect("/admin/users");
    } catch (err) {
      console.error(err);
      res.send("Error updating user status");
    }
  },
};

module.exports = userController;
