const { fetchReview } = require('../models/reviewsModel');

exports.getReview = (request, response, next) => {
    const { review_id } = request.params;
    fetchReview(review_id).then(review => {
        response.status(200).send({ review })
    })
    .catch(err => next(err));
}