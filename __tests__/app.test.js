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
    describe(`/reviews`, () => {
        describe(`/:review_id`, () => {
            test('status 200, returns a review object including comment count', () => {
                return request(app)
                .get('/api/reviews/2')
                .expect(200)
                .then(({ body }) => {
                    const { review } = body;
                    expect(review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                            designer: 'Leslie Scott',
                            owner: 'philippaclaire9',
                            review_img_url:
                              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            review_body: 'Fiddly fun for all the family',
                            category: 'dexterity',
                            created_at: "2021-01-18T10:01:41.251Z",
                            votes: 5,
                            comment_count: "3",
                    })
                });
            })
            test('ERROR non-existent valid id returns 404 not found', () => {
                return request(app)
                    .get('/api/reviews/999999')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe("review_id not found")
                    })
            })
            test('ERROR invalid id returns 400 bad request', () => {
                return request(app)
                    .get('/api/reviews/epidemic')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe("bad request - review_id is not a number")
                    })
            })
        })
    })
    describe(`/users`, () => {
        test('status 200, returns all users', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    expect(users).toBeInstanceOf(Array);
                    expect(users.length).toBe(4);
                    users.forEach(user => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String),
                            })
                        );
                    });
                });
        });
    });
});
