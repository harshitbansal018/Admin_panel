const publisherModel = require('../../model/admin/publisherModel');

const publisherController = {

    // 📄 Get all publishers (from users table)
    getPublishers: async (req, res) => {
        try {
            const user = req.session.user;

            // 🔐 Check login
            if (!user) {
                return res.redirect('/admin/login');
            }

            // 🚨 Only admin can access
            if (user.role !== 'admin') {
                return res.send("Access Denied: Admin only");
            }

            // 📊 Get publishers with movie count
            const publishers = await publisherModel.getAllPublishers();

            res.render('admin/admin', {
                activePage: 'publisher',
                publishers: publishers,
                user: user   // ✅ pass user to view
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching publishers');
        }
    }

};

module.exports = publisherController;