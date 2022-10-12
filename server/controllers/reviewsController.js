const {
    fetchReview,
    updateReview,
} = require('../models/reviewsModel');

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