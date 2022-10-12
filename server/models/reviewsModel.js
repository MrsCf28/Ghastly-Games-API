const db = require('../../db/connection');
const {
    badRequestId,
    itemNotFound,
    badRequestNeg,
    badRequestQuery,
} = require('../error-handling');

exports.fetchReviews = category => {
    let baseParam = [];
    let baseQuery = `SELECT 
                        reviews.*,
                        CAST(COUNT(comments.comment_id) as INTEGER) AS comment_count
                    FROM reviews
                    LEFT JOIN comments ON comments.review_id = reviews.review_id
                    `;
    if (category) {
        baseParam.push(category);
        baseQuery += `WHERE category = $1
        `;
    }
    baseQuery += `GROUP BY reviews.review_id
                ORDER BY created_at DESC;`;
    return db
        .query(baseQuery, baseParam)
        .then(({ rows: reviews }) => {
            return reviews;
        });
};

exports.fetchReview = id => {
    if (isNaN(id)) {
        return badRequestId('review_id');
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
                return itemNotFound('review_id');
            }
            return review[0];
        });
};

exports.updateReview = (id, newVotes) => {
    if (newVotes === undefined) {
        return badRequestQuery('inc_votes');
    }
    if (isNaN(id)) {
        return badRequestId('review_id');
    }
    if (isNaN(newVotes)) {
        return badRequestId('inc_votes');
    }
    return db
        .query(
            `UPDATE reviews
            SET votes = votes + $1
            WHERE review_id = $2
            RETURNING *;`,
            [newVotes, id]
        )
        .then(({ rows: review }) => {
            if (review.length === 0) {
                return itemNotFound('review_id');
            } else if (review[0].votes < 0) {
                return badRequestNeg('total votes');
            } else {
                return review[0];
            }
        });
};
