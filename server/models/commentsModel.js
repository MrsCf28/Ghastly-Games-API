const db = require('../../db/connection');
const {
    badRequestId,
    badRequestQuery,
    itemNotFound,
} = require('../error-handling');

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

exports.fetchAllComments = () => {
    return db
        .query(
            `SELECT *
            FROM comments`
        )
        .then(({ rows: comments }) => {
            return comments;
        });
};

exports.addComment = (id, username, body) => {
    if (!username || !body) {
        return badRequestQuery('username or body');
    }
    return db
        .query(
            `INSERT INTO comments
            (body, votes, author, review_id)
            VALUES
            ($1, 0, $2, $3)
            RETURNING *`,
            [body, username, id]
        )
        .then(({ rows: comment }) => {
            return comment[0];
        });
};

exports.removeComment = id => {
    if (isNaN(id)) {
        return badRequestId('comment_id');
    }
    return db
        .query(
            `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING*`,
            [id]
        )
        .then(({ rows: comment }) => {
            if (comment.length === 0) {
                return itemNotFound('comment_id');
            }
            Promise.resolve;
        });
};
