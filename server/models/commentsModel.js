const db = require('../../db/connection');
const { badRequestId } = require('../error-handling');

exports.fetchComments = id => {
    if (isNaN(id)) {
        return badRequestId('review_id');
    }
    return db
        .query(
            `SELECT * FROM comments
            WHERE review_id = $1
            ORDER BY created_at DESC`,
            [id]
        )
        .then(({ rows: comments }) => {
            return comments;
        });
};
