const { badRequestQuery } = require('../error-handling');
const {
    fetchComments,
    addComment,
    removeComment,
    fetchAllComments,
} = require('../models/commentsModel');
const { fetchReviewIdIfExists } = require('../models/reviewsModel');

exports.getComments = (request, response, next) => {
    const { review_id } = request.params;

    const promises = [fetchComments(review_id)];

    if (review_id) {
        promises.push(fetchReviewIdIfExists(review_id));
    }

    Promise.all(promises)
        .then(promises => {
            response.status(200).send({ comments: promises[0] });
        })
        .catch(err => next(err));
};

exports.getAllComments = (request, response, next) => {
    fetchAllComments().then(comments => {
        response.status(200).send({ comments });
    });
};

exports.postComment = (request, response, next) => {
    const { review_id } = request.params;
    const { username, body } = request.body;

    if (review_id) {
        fetchReviewIdIfExists(review_id)
            .then(() => {
                return addComment(review_id, username, body);
            })
            .then(comment => {
                response.status(201).send({ comment });
            })
            .catch(next);
    } else {
        return badRequestQuery('review_id');
    }
};

exports.deleteComment = (request, response, next) => {
    const { comment_id } = request.params;

    removeComment(comment_id)
        .then(() => {
            response.status(204).send();
        })
        .catch(next);
};
