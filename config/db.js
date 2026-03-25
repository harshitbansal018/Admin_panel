const mysql = require('mysql2');

const rawConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Stellen@12',
  database: 'admin_panel'
});

rawConnection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

const db = rawConnection.promise();
module.exports = db;