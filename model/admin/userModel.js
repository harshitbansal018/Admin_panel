const db = require('../../config/db');

// 🔍 Find user by email (general)
exports.findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    return rows[0];
};

// 🔐 Find ACTIVE user (BEST for login)
exports.findActiveUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
        [email]
    );
    return rows[0];
};

// 🔍 Check if email exists (for signup)
exports.emailExists = async (email) => {
    const [rows] = await db.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    return rows.length > 0;
};

// ➕ Create new user (DEFAULT ROLE = USER ✅)
exports.createUser = async (name, email, password, role = "user") => {

    // 🚨 Validate role
    if (!["admin", "publisher", "user"].includes(role)) {
        throw new Error("Invalid role");
    }

    return await db.query(
        "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
        [name, email, password, role, 1]
    );
};

// 👥 Get ONLY admin + publisher (admin panel)
exports.getAdminAndPublishers = async () => {
    const [users] = await db.query(
        "SELECT id, name, email, role, is_active, created_at FROM users WHERE role IN ('admin','publisher') ORDER BY id DESC"
    );
    return users;
};

// 👤 Get ONLY normal users
exports.getNormalUsers = async () => {
    const [users] = await db.query(
        "SELECT id, name, email, is_active, created_at FROM users WHERE role = 'user' ORDER BY id DESC"
    );
    return users;
};

// 🔍 Get user by ID (safe - no password)
exports.getUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name, email, role, is_active FROM users WHERE id = ?",
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

// 🔄 Update user role
exports.updateUserRole = async (id, role) => {

    if (!["admin", "publisher", "user"].includes(role)) {
        throw new Error("Invalid role");
    }

    return await db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id]
    );
};

// 👥 Get all users
exports.getAllUsers = async () => {
    const [users] = await db.query(
        "SELECT id, name, email, role, is_active, created_at FROM users WHERE role = 'user' ORDER BY id DESC"
    );
    return users;
};