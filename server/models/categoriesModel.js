const db = require('../../db/connection');
const categories = require('../../db/data/test-data/categories');
const { itemNotFound } = require('../error-handling');

exports.fetchCategories = () => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows: categories }) => categories);
};

exports.fetchCategoryIfExists = categoryToCheck => {
    return db
        .query(
            `
        SELECT * FROM categories
        WHERE slug = $1`,
            [categoryToCheck]
        )
        .then(({ rows: category }) => {
            if (category.length === 0) {
                return itemNotFound('category');
            } else {
                return category[0];
            }
        });
};
