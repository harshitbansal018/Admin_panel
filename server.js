const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const db = require('./config/db'); // DB connection
const userRoutes = require('./routes/admin/userRoute'); // Routes
const movieTypeRoutes = require('./routes/admin/movietypeRoute'); // Movie type routes
const movieRoutes = require('./routes/admin/moviesRoutes'); // Movie routes
const dashboardRoute = require('./routes/admin/dashboardRoute'); // Dashboard route
const publisherRoute = require('./routes/admin/publisherRoute'); // Publisher route
const app = express();
const PORT = process.env.PORT || 3000;
const initDB = require('./utils/dbInit');
const { importData } = require('./services/seedServices');
const fs = require('fs');

initDB();

// Auto load JSON
if (fs.existsSync('./data/data.json')) {
  importData();
}
// 🔐 SESSION SETUP

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
   cookie: {
        maxAge: 60 * 60 * 1000  // ⏰ 10 minutes
    }
}));
// 🧱 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const noCache=(req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
};
app.use(noCache); // Apply no-cache to all routes

// 📁 STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
// 🎨 VIEW ENGINE

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/admin'));
// 👤 GLOBAL USER (IMPORTANT)

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 🚀 ROUTES

app.use('/admin', userRoutes);
app.use('/admin', movieTypeRoutes);
app.use('/admin', movieRoutes);
app.use('/admin', dashboardRoute);
app.use('/admin', publisherRoute);

// 🔁 DEFAULT ROUTE

app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

// ❌ 404 HANDLER
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});
// 🟢 START SERVER

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}/admin/login`);
});