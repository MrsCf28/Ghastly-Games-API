const express = require('express');
const { getCategories } = require('./controllers/categoriesController')
const { getReview } = require('./controllers/reviewsController')

const app = express();
// app.use(express.json()); - don't forget this for later

app.get(`/api/categories`, getCategories);
app.get(`/api/reviews/:review_id`, getReview);

// error handling
app.all('/api/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
});

module.exports = app