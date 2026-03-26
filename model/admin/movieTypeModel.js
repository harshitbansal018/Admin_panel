const db = require('../../config/db');

exports.getAllTypes = async () => {
    const [types] = await db.query('SELECT * FROM movie_types');
    return types;
};

exports.getTypeById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM movie_types WHERE id = ?',
        [id]
    );
    return rows[0];
};


exports.deleteType = async (id) => {
    return await db.query(
        "DELETE FROM movie_types WHERE id = ?",
        [id]
    );
};


