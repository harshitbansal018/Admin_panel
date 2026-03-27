const dashboardModel = require('../../model/publishers/dashboardModel');

exports.getDashboard = async (req, res) => {
try {
// 🔐 Check if user is logged in
if (!req.session.user || req.session.user.role !== 'publisher') {
return res.redirect('/publisher/login');
}


    const publisherId = req.session.user.id;

    // 🔍 Fetch counts
    const counts = await dashboardModel.getPublisherCounts(publisherId);

    res.render('publishers/admin', {
        activePage: 'dashboard',
        totalMovies: counts.totalMovies || 0,
        inProgress: counts.inProgress || 0,
        rejected: counts.rejected || 0,
        user: req.session.user
    });
  console.log("Publisher ID:", req.session.user.id);

} catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send('Publisher Dashboard error');
}


};
