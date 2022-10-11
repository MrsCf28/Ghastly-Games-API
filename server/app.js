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
const { getUsers } = require('./controllers/usersControllers');

const app = express();
app.use(express.json());

// api requests
app.get(`/api/categories`, getCategories);
app.get(`/api/reviews`, getReviews);
app.get(`/api/reviews/:review_id`, getReview);
app.get(`/api/users`, getUsers);

app.patch(`/api/reviews/:review_id`, patchReview);

// error handling
app.use(handleEndPointErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
