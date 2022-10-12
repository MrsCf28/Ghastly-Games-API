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

exports.addComment = (id, username, body) => {
    const date = new Date(Date.now());
    return db
        .query(
            `INSERT INTO comments
            (body, votes, author, review_id, created_at)
            VALUES
            ($1, 0, $2, $3, $4)
            RETURNING *`,
            [body, username, id, date]
        )
        .then(({ rows: comment }) => {
            return comment[0];
        });
};
