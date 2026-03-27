const db = require('../../config/db');
const dashboardModel = require('../../model/admin/dashboardModel');
exports.getDashboard = async (req, res) => {
    try {
        // calling the function from model folder of database query
       const counts= await dashboardModel.getCounts();

        res.render('admin/admin', {
            activePage: 'dashboard',
            totalMovies: counts.totalMovies,
            totalUsers: counts.totalUsers,
            totalTypes: counts.totalTypes
        });

    } catch (err) {
        console.error(err);
        res.send('Dashboard error');
    }
};