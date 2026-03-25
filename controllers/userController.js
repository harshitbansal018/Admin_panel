const bcrypt = require("bcrypt");
const db = require("../config/db");

const userController = {
  // 🔐 Show Login Page
  getLogin: (req, res) => {
    res.render("login", { error: null, success: null });
  },

  // 🔐 Handle Login
  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.render("login", {
          error: "All fields are required",
          success: null,
        });
      }

      // Find user
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return res.render("login", {
          error: "User not found",
          success: null,
        });
      }

      const user = rows[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("login", {
          error: "Invalid password",
          success: null,
        });
      }

      // Store session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error(err);
      res.render("login", {
        error: "Login failed",
        success: null,
      });
    }
  },

  // 📝 Show Signup Page
  getSignup: (req, res) => {
    res.render("signup", { error: null, success: null });
  },

  // 📝 Handle Signup
  postSignup: async (req, res) => {
    const { name, email, password } = req.body;
    console.log("name:", name, "email:", email, "password:", password);

    if (!name || !email || !password) {
      return res.render("signup", {
        error: "All fields are required",
        success: null,
      });
    }
    // Check if email exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.render("signup", {
        error: "Email already exists",
        success: null,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      "INSERT INTO users (email, password, is_active, name) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, 1, name],
    );

    res.render("login", {
      error: null,
      success: "Signup successful! Please login.",
    });

    //  cat
    //     console.error('Signup failed:', err);
    //     return res.render('signup', {
    //         error: 'Signup failed: ' + (err.message || 'Unknown error'),
    //         success: null
    //     });
    // }
  },

  getUsers: async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email, is_active, created_at FROM users"
        );

        res.render("admin", {
            activePage: "users",
            user: req.session.user,
            users: users,

        });

    } catch (err) {
        console.error(err);
        res.send("Error fetching users");
    }
},

  // 🚪 Logout
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/admin/login");
    });
  },
};

module.exports = userController;
