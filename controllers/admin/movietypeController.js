const movieTypeModel = require('../../model/admin/movieTypeModel');

const movieTypeController = {

    // Get all movie types
    getMovieTypes: async (req, res) => {
        try {
            const types = await movieTypeModel.getAllTypes();

            res.render('admin', {   // ✅ based on your views/admin setup
                activePage: 'movie-types',
                types
            });

        } catch (err) {
            console.error(err);
            res.send('Error fetching movie types');
        }
    },

    // Show Add Movie Type Page
    getAddMovieType: (req, res) => {
        res.render('add-movie-type', {
            activePage: 'add-movie-type'
        });
    },

    // Insert Movie Type
    postAddMovieType: async (req, res) => {
        const { name, status } = req.body;

        try {
            if (!name) {
                return res.send('Name is required');
            }

            await movieTypeModel.addMovieType(name, status || 'active');

            res.redirect('/admin/movie-types');

        } catch (err) {
            console.error(err);
            res.send('Error adding movie type');
        }
    },

    // Toggle Status
    toggleStatus: async (req, res) => {
        const id = req.params.id;

        try {
            const type = await movieTypeModel.getTypeById(id);

            if (!type) {
                return res.send('Type not found');
            }

            const newStatus =
                type.status === 'active' ? 'inactive' : 'active';

            await movieTypeModel.updateStatus(id, newStatus);

            res.redirect('/admin/movie-types');

        } catch (err) {
            console.error(err);
            res.send('Error updating status');
        }
    },
    // Delete Movie Type
    deleteMovieType: async (req, res) => {
        const id = req.params.id;
        try {
            const type = await movieTypeModel.getTypeById(id);
            if (!type) {
                return res.send('Type not found');
            }
            await movieTypeModel.deleteType(id);
            res.redirect('/admin/movie-types');
        } catch (err) {
            console.error(err);
            res.send('Error deleting movie type');
        }}

};

module.exports = movieTypeController;