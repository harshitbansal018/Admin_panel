const bcrypt = require("bcrypt");
const userModel = require("../../model/admin/userModel");

const userController = {

  // 🔐 Show Login Page
  getLogin: (req, res) => {
    res.render("admin/login", { error: null, success: null });
  },

  // 🔐 Handle Login (IMPROVED)
  postLogin: async (req, res) => {
    let { email, password, role } = req.body;

    try {
      // 🔥 Normalize input
      email = email?.trim().toLowerCase();
      password = password?.trim();

      if (!email || !password || !role) {
        return res.render("admin/login", {
          error: "All fields are required",
          success: null,
        });
      }

      // 🔥 Use ACTIVE USER method (better)
      const user = await userModel.findActiveUserByEmail(email);

      if (!user) {
        return res.render("admin/login", {
          error: "User not found or inactive",
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

      // 🚨 ROLE VALIDATION
      if (user.role !== role) {
        return res.render("admin/login", {
          error: `You selected "${role}" but your account is "${user.role}"`,
          success: null,
        });
      }

      // ✅ Store session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // 🔀 Redirect based on role
      if (user.role === "admin") {
        return res.redirect("/admin/dashboard");
      } 
      else if (user.role === "publisher") {
        return res.redirect("/publisher/dashboard");
      } 
      else if (user.role === "user") {
        return res.redirect("/user/home"); // ✅ USER LOGIN
      } 
      else {
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

  // 📝 Signup Page
  getSignup: (req, res) => {
    res.render("admin/signup", { error: null, success: null });
  },

  // 📝 Signup (FIXED FOR USERS)
  postSignup: async (req, res) => {
    let { name, email, password } = req.body;

    try {
      name = name?.trim();
      email = email?.trim().toLowerCase();
      password = password?.trim();

      if (!name || !email || !password) {
        return res.render("admin/signup", {
          error: "All fields are required",
          success: null,
        });
      }

      // 🔥 Better check
      const exists = await userModel.emailExists(email);

      if (exists) {
        return res.render("admin/signup", {
          error: "Email already exists",
          success: null,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔥 IMPORTANT CHANGE
      await userModel.createUser(name, email, hashedPassword, "user"); // ✅ user role

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
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.redirect("/");
    }

    // 🔥 destroy cookie also
    res.clearCookie("session_id");

    // 🔥 prevent back button cache
    res.set("Cache-Control", "no-store");

    return res.redirect("/admin/login");
  });
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