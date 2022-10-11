const {
    fetchCategoryIfExists,
} = require('../models/categoriesModel');
const {
    fetchReview,
    updateReview,
    fetchReviews,
} = require('../models/reviewsModel');

exports.getReviews = (request, response, next) => {
    const { category } = request.query;

    const promises = [fetchReviews(category)];

    if (category) {
        promises.push(fetchCategoryIfExists(category));
    }

    Promise.all(promises)
        .then(reviews => {
            response.status(200).send({ reviews: reviews[0] });
        })
        .catch(err => next(err));
};

exports.getReview = (request, response, next) => {
    const { review_id } = request.params;
    fetchReview(review_id)
        .then(review => {
            response.status(200).send({ review });
        })
        .catch(err => next(err));
};

exports.patchReview = (request, response, next) => {
    const { review_id } = request.params;
    const { inc_votes } = request.body;
    updateReview(review_id, inc_votes)
        .then(review => {
            response.status(202).send({ review });
        })
        .catch(err => next(err));
};
