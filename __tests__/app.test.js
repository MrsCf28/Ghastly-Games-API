const seed = require('../db/seeds/seed');
const {
    categoryData,
    reviewData,
    userData,
    commentData,
} = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');

beforeEach(() =>
    seed({ categoryData, reviewData, userData, commentData })
);

afterAll(() => {
    db.end();
});

describe(`GET /api`, () => {
    describe(`/categories`, () => {
        test('status 200, returns all categories', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({ body }) => {
                    const { categories } = body;
                    expect(categories).toBeInstanceOf(Array);
                    expect(categories.length).toBe(4);
                    categories.forEach(category => {
                        expect(category).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String),
                            })
                        );
                    });
                });
        });
        test('a misspelt endpoint is caught with a status 404', () => {
            return request(app)
                .get('/api/categorys')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Route not found');
                });
        })
        test('a missing endpoint is caught with a status 404', () => {
            return request(app)
                .get('/api/')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Route not found');
                });
        })
    });
});
