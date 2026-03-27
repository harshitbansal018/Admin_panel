const dashboardModel = require('../../model/publishers/dashboardModel');

exports.getDashboard = async (req, res) => {
try {
// 🔐 Check if user is logged in
if (!req.session.publisher) {
    return res.redirect('/publisher/login');
}


    const publisherId = req.session.publisher.id;

    // 🔍 Fetch counts
    const counts = await dashboardModel.getPublisherCounts(publisherId);

    res.render('publishers/admin', {
        activePage: 'dashboard',
        totalMovies: counts.totalMovies || 0,
        inProgress: counts.inProgress || 0,
        rejected: counts.rejected || 0,
        user: req.session.publisher
    });
//   console.log("Publisher ID:", req.session.user.id);
// console.log("DASHBOARD SESSION:", req.session);
} catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send('Publisher Dashboard error');
}


};
