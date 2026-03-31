// 🔐 Check if logged in (GENERIC)
const isAuth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.redirect("/admin/login");
};

// 👑 Admin only
const isAdmin = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/admin/login");
  }

  if (req.session.user.role === "admin") {
    return next();
  }

  // ❌ Logged in but wrong role
  return res.redirect("/");
};

// 🧑‍💼 Publisher only
const isPublisher = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/admin/login");
  }

  if (req.session.user.role === "publisher") {
    return next();
  }

  return res.redirect("/");
};

// 👤 User only (🔥 NEW - IMPORTANT)
const isUser = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/admin/login");
  }

  if (req.session.user.role === "user") {
    return next();
  }

  return res.redirect("/");
};

module.exports = { isAuth, isAdmin, isPublisher, isUser };