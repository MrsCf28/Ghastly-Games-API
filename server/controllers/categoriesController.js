const { fetchCategories } = require('../models/categoriesModel');

exports.getCategories = (request, response, next) => {
    fetchCategories().then(categories => {
        response.status(200).send({ categories });
    })
    // .catch(err => next(err));
};
