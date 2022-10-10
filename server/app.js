const express = require('express');
const { getCategories } = require('./controllers/controller')

const app = express();
// app.use(express.json()); - don't forget this for later

app.get(`/api/categories`, getCategories);

// error handling
app.all('/api/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

// app.use((err, req, res, next) => {
//     console.log(err);
//     res.sendStatus(500);
// });

module.exports = app