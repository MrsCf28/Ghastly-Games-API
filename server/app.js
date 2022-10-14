const express = require('express');
const {
    getCategories,
} = require('./controllers/categoriesController');
const {
    handleEndPointErrors,
    handleCustomErrors,
    handleInternalErrors,
} = require('./controllers/errorsController');
const {
    getReview,
    patchReview,
    getReviews,
} = require('./controllers/reviewsController');
const {
    getComments,
    postComment,
    deleteComment,
    getAllComments,
} = require('./controllers/commentsController');
const { getUsers } = require('./controllers/usersControllers');
const { getEndpoints } = require('./controllers/endpointsController');

const app = express();
app.use(express.json());

// api requests
app.get(`/api`, getEndpoints);
app.get(`/api/categories`, getCategories);
app.get(`/api/reviews`, getReviews);
app.get(`/api/reviews/:review_id`, getReview);
app.get(`/api/reviews/:review_id/comments`, getComments);
app.get(`/api/users`, getUsers);
app.get(`/api/comments`, getAllComments);

app.post(`/api/reviews/:review_id/comments`, postComment);

app.patch(`/api/reviews/:review_id`, patchReview);

app.delete(`/api/comments/:comment_id`, deleteComment);

// error handling
app.use(handleEndPointErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
