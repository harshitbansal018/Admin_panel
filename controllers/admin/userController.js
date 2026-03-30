const bcrypt = require("bcrypt");
const userModel = require("../../model/admin/userModel");

const userController = {

  // 🔐 Show Login Page
  getLogin: (req, res) => {
    res.render("admin/login", { error: null, success: null });
  },

  // 🔐 Handle Login (ROLE BASED)
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

      // 🚫 Check active
      if (!user.is_active) {
        return res.render("admin/login", {
          error: "Account inactive. Contact admin.",
          success: null,
        });
      }

      // 🔐 Password check
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("admin/login", {
          error: "Invalid password",
          success: null,
        });
      }

      // ✅ Store session (IMPORTANT CHANGE)
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔥 dynamic role
      };

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "admin") {
        return res.redirect("/admin/dashboard");
      } else if (user.role === "publisher") {
        return res.redirect("/publisher/dashboard");
      } else {
        return res.render("admin/login", {
          error: "Invalid role assigned",
          success: null,
        });
      }

    } catch (err) {
      console.error(err);
      res.render("admin/login", {
        error: "Login failed",
        success: null,
      });
    }
  },

  // 📝 Signup (Default role = publisher)
  getSignup: (req, res) => {
    res.render("admin/signup", { error: null, success: null });
  },

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

      // ✅ Default role = publisher
      await userModel.createUser(name, email, hashedPassword, "publisher");

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

  // 👥 Get Users (Admin only)
  getUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();

      res.render("admin/admin", {
        activePage: "users",
        user: req.session.user,
        users,
      });

    } catch (err) {
      console.error(err);
      res.send("Error fetching users");
    }
  },

  // 🚪 Logout
  logout: (req, res) => {
    req.session.destroy();   // ✅ better than null
    return res.redirect("/admin/login");
  },

  // 🔁 Toggle Active Status
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