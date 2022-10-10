const db = require('../../db/connection');
const categories = require('../../db/data/test-data/categories');

exports.fetchCategories = () => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows: categories }) => categories);
};
