const movieModel = require('../../model/user/movieModel');

const homeController = {

    // 🏠 USER HOME PAGE
    getHome: async (req, res) => {
        try {
            const { type, publisher } = req.query;

            // 🎬 Get movies from model
            const movies = await movieModel.getFilteredMovies(type, publisher);

            // 📊 Get filters
            const types = await movieModel.getAllTypes();
            const publishers = await movieModel.getAllPublishers();

            // 🎯 Render view
            res.render('user/home', {
                movies,
                types,
                publishers
            });

        } catch (err) {
            console.error("Home Error:", err);
            res.send("Error loading movies");
        }
    }

};

module.exports = homeController;