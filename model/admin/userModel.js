const db = require('../../config/db');

// 🔍 Find user by email
exports.findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

// ➕ Create new user (WITH ROLE)
exports.createUser = async (name, email, password, role = "publisher") => {
    return await db.query(
        "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
        [name, email, password, role, 1]
    );
};

// 👥 Get all users (include role)
exports.getAllUsers = async () => {
    const [users] = await db.query(
        "SELECT id, name, email, role, is_active, created_at FROM users"
    );
    return users;
};

// 🔍 Get user by ID
exports.getUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

// 🔁 Update active status
exports.updateUserStatus = async (id, status) => {
    return await db.query(
        "UPDATE users SET is_active = ? WHERE id = ?",
        [status, id]
    );
};

// 🔄 Update user role (🔥 ADMIN FEATURE)
exports.updateUserRole = async (id, role) => {
    return await db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id]
    );
};