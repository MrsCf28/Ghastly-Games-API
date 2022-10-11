const db = require('../../db/connection');

exports.fetchReview = (id) => {
    if (isNaN(id)) {
        return Promise.reject({
            status: 400,
            msg: 'bad request - review_id is not a number',
        });
    }
    return db
        .query(`
        SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
        FROM reviews
        JOIN comments ON comments.review_id=reviews.review_id
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;`, [id])
        .then(({ rows: review }) => {
            if (review.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "review_id not found",
                })
            }
            return review[0]
        })
};