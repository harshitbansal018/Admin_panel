// middleware/auth.js

// 🔐 Check if logged in (generic)
const isAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/admin/login"); // default login
};

// 👑 Admin only
const isAdmin = (req, res, next) => {
  if (req.session?.user?.role === "admin") {
    return next();
  }

  // 🔁 Redirect based on situation
  if (!req.session?.user) {
    return res.redirect("/admin/login");
  }

  return res.redirect("/publisher/dashboard"); // logged but wrong role
};

// 🧑‍💼 Publisher only
// 🧑‍💼 Publisher only
const isPublisher = (req, res, next) => {
  // ✅ Allow if role is publisher
   console.log("SESSION CHECK:", req.session.user); 
  if (req.session?.user?.role === "publisher") {
    return next();
  }

  // ❌ Not logged in → go to main login
  if (!req.session?.user) {
    return res.redirect("/admin/login");   // ✅ FIXED
  }

  // ❌ Logged in but wrong role
  return res.redirect("/");
};
module.exports = { isAuth, isAdmin, isPublisher };