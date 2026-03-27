const db = require('../../config/db');

exports.getPublisherCounts = async (publisherId) => {
try {
const [totalMovies] = await db.query(
"SELECT COUNT(*) AS total FROM movies WHERE publisher_id = ?",
[publisherId]
);


    // ✅ active = in progress
    const [inProgress] = await db.query(
        "SELECT COUNT(*) AS total FROM movies WHERE publisher_id = ? AND status = 'active'",
        [publisherId]
    );

    // ✅ inactive = rejected
    const [rejected] = await db.query(
        "SELECT COUNT(*) AS total FROM movies WHERE publisher_id = ? AND status = 'inactive'",
        [publisherId]
    );

    return {
        totalMovies: totalMovies[0].total,
        inProgress: inProgress[0].total,
        rejected: rejected[0].total
    };

} catch (err) {
    throw err;
}


};
