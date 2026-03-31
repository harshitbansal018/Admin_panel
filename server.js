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
const adminPublisherRoutes = require('./routes/admin/publisherRoute');

// 🔹 Publisher Routes
const publisherDashboardRoute = require('./routes/publishers/dashboardRoute');
const publisherMoviesRoutes = require('./routes/publishers/moviesRoute');

// 🔹 User Routes
const userHome = require('./routes/user/userRoute');

// 🔐 Middleware
const { isAuth, isAdmin, isPublisher, isUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// 🗄️ DB INIT + SEED
// ==========================
initDB();

// ❌ REMOVE AUTO SEED (IMPORTANT)
// if (fs.existsSync('./data/data.json')) {
//   importData();
// }

// ==========================
// 🔐 SESSION CONFIG
// ==========================
app.use(session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET || 'supersecret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 min
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
}));

// ==========================
// 🧱 MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 NO CACHE (BACK BUTTON FIX)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ==========================
// 🎨 VIEW ENGINE
// ==========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================
// 🌍 GLOBAL USER
// ==========================
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  res.locals.role = req.session?.user?.role || null;
  next();
});

// ==========================
// 📁 STATIC FILES
// ==========================
app.use(express.static(path.join(__dirname, 'public')));

// ==========================
// 🚀 ROUTES
// ==========================

// 🔹 Public Auth Routes
app.use('/admin', userRoutes);

// 🔹 Admin Routes
app.use('/admin', isAuth, isAdmin, movieTypeRoutes);
app.use('/admin', isAuth, isAdmin, movieRoutes);
app.use('/admin', isAuth, isAdmin, dashboardRoute);
app.use('/admin', isAuth, isAdmin, adminPublisherRoutes);

// 🔹 Publisher Routes
app.use('/publisher', isAuth, isPublisher, publisherDashboardRoute);
app.use('/publisher', isAuth, isPublisher, publisherMoviesRoutes);

// 🔹 User Routes (🔥 FIXED)
app.use('/user', isAuth, isUser, userHome);

// ==========================
// 🔁 DEFAULT ROUTE
// ==========================
app.get('/', (req, res) => {
  if (req.session?.user) {

    if (req.session.user.role === "admin") {
      return res.redirect('/admin/dashboard');
    } 
    else if (req.session.user.role === "publisher") {
      return res.redirect('/publisher/dashboard');
    } 
    else if (req.session.user.role === "user") {
      return res.redirect('/user/home');
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