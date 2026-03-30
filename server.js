const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

// 🔗 DB + INIT
const db = require('./config/db');
const initDB = require('./utils/dbInit');
const { importData } = require('./services/seedServices');

// 🔗 ROUTES
const userRoutes = require('./routes/admin/userRoute');
const movieTypeRoutes = require('./routes/admin/movietypeRoute');
const movieRoutes = require('./routes/admin/moviesRoutes');
const dashboardRoute = require('./routes/admin/dashboardRoute');

// ⚠️ Rename this if it's admin managing users
const adminPublisherRoutes = require('./routes/admin/publisherRoute');

// Publisher routes
const publisherAuthRoutes = require('./routes/publishers/publisherRoute');
const publisherDashboardRoute = require('./routes/publishers/dashboardRoute');
const publisherMoviesRoutes = require('./routes/publishers/moviesRoute');

const app = express();
const PORT = process.env.PORT || 3000;


// ==========================
// 🗄️ DB INIT + SEED
// ==========================
initDB();

if (fs.existsSync('./data/data.json')) {
  importData();
}


// ==========================
// 🔐 SESSION CONFIG
// ==========================
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 minutes
    httpOnly: true,         // 🔥 security
  }
}));


// ==========================
// 🧱 MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚫 Disable cache (important for auth)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});


// ==========================
// 🎨 VIEW ENGINE
// ==========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ==========================
// 🌍 GLOBAL USER (ROLE BASED)
// ==========================
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.role = req.session.user?.role || null;
  next();
});


// ==========================
// 📁 STATIC FILES
// ==========================
app.use(express.static(path.join(__dirname, 'public')));


// ==========================
// 🚀 ROUTES
// ==========================

// 🔹 Admin Routes
app.use('/admin', userRoutes);
app.use('/admin', movieTypeRoutes);
app.use('/admin', movieRoutes);
app.use('/admin', dashboardRoute);
app.use('/admin', adminPublisherRoutes);

// 🔹 Publisher Routes
app.use('/publisher', publisherAuthRoutes);
app.use('/publisher', publisherDashboardRoute);
app.use('/publisher', publisherMoviesRoutes);


// ==========================
// 🔁 DEFAULT ROUTE (SMART)
// ==========================
app.get('/', (req, res) => {
  if (req.session?.user) {
    if (req.session.user.role === "admin") {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/publisher/dashboard');
    }
  }
  res.redirect('/admin/login');
});


// ==========================
// ❌ 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});


// ==========================
// 🟢 START SERVER
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/admin/login`);
});