const db = require('../../config/db');

// Find user by email
exports.findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

// Create new user
exports.createUser = async (name, email, password) => {
    return await db.query(
        "INSERT INTO users (email, password, is_active, name) VALUES (?, ?, ?, ?)",
        [email, password, 1, name]
    );
};

// Get all users
exports.getAllUsers = async () => {
    const [users] = await db.query(
        "SELECT id, name, email, is_active, created_at FROM users"
    );
    return users;
};
// Get user by ID
exports.getUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

// Update status
exports.updateUserStatus = async (id, status) => {
    return await db.query(
        "UPDATE users SET is_active = ? WHERE id = ?",
        [status, id]
    );
};