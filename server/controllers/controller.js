const { fetchCategories } = require('../models/model');

exports.getCategories = (request, response, next) => {
    fetchCategories().then(categories => {
        response.status(200).send({ categories });
    })
    // .catch(err => next(err));
};
