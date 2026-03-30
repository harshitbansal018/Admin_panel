const dashboardModel = require('../../model/publishers/dashboardModel');

exports.getDashboard = async (req, res) => {
  try {
    // 🔐 Check login (NEW SYSTEM)
    if (!req.session?.user || req.session.user.role !== "publisher") {
      return res.redirect('/admin/login'); // ✅ FIXED
    }

    const publisherId = req.session.user.id; // ✅ FIXED

    // 🔍 Fetch counts
    const counts = await dashboardModel.getPublisherCounts(publisherId);

    res.render('publishers/admin', {   // ✅ FIXED VIEW NAME
      activePage: 'dashboard',
      totalMovies: counts.totalMovies || 0,
      inProgress: counts.inProgress || 0,
      rejected: counts.rejected || 0,
      user: req.session.user              // ✅ FIXED
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send('Publisher Dashboard error');
  }
};