const db = require('../../config/db');
const publisherModel = require('../../model/admin/publisherModel');

const publisherController = {

    // 📄 Get all publishers with movie count
    getPublishers: async (req, res) => {
        try {
            const publishers = await publisherModel.getAllPublishers(); // ✅ FIXED

            res.render('admin/admin', {
                activePage: 'publisher',
                publishers: publishers
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching publishers');
        }
    }

};

module.exports = publisherController;