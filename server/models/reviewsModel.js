const db = require('../../db/connection');
const {
    badRequestId,
    itemNotFound,
    badRequestNeg,
    badRequestQuery,
    invalidRequestParameter,
} = require('../error-handling');

exports.fetchReviews = (category, sortedBy, order) => {
    if (order) {
        if (!['ASC', 'DESC', 'asc', 'desc'].includes(order)) {
            return invalidRequestParameter(order);
        }
    }
    let baseParam = [];
    let baseQuery = `SELECT reviews.*,
                    CAST(COUNT(comments.comment_id) as INTEGER) AS comment_count
                    FROM reviews
                    LEFT JOIN comments ON comments.review_id = reviews.review_id
                    `;

    let orderBy = order || 'DESC';

    if (category) {
        baseParam.push(category);
        baseQuery += `WHERE category = $1
        `;
    }

    baseQuery += `GROUP BY reviews.review_id
                ORDER BY ${sortedBy} ${orderBy.toUpperCase()};`;

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
        .query(
            `
        SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id=reviews.review_id
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;`,
            [id]
        )
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

exports.fetchReviewIdIfExists = id => {
    if (isNaN(id)) {
        return badRequestId('review_id');
    }
    return db
        .query(
            `
            SELECT review_id
            FROM reviews
            WHERE review_id = $1`,
            [id]
        )
        .then(({ rows: review_id }) => {
            if (review_id.length === 0) {
                return itemNotFound('review_id');
            } else {
                return review_id[0];
            }
        });
};

exports.checkReviewSortByIsValid = sort_by => {
    if (!sort_by) {
        return;
    }
    return db
        .query(
            `SELECT *
            FROM reviews
            LIMIT 1;`
        )
        .then(({ rows: [review] }) => {
            if (!Object.keys(review).includes(sort_by)) {
                return invalidRequestParameter(sort_by);
            } else {
                return;
            }
        });
};
