const db = require('../../config/db');

exports.getPublisherCounts = async (publisherId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS totalMovies,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS rejected
      FROM movies
      WHERE publisher_id = ?
    `, [publisherId]);

    return {
      totalMovies: rows[0].totalMovies || 0,
      inProgress: rows[0].inProgress || 0,
      rejected: rows[0].rejected || 0
    };

  } catch (err) {
    throw err;
  }
};