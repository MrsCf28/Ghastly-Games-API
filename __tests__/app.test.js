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
        });
        test('a missing endpoint is caught with a status 404', () => {
            return request(app)
                .get('/api/')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Route not found');
                });
        });
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
                            review_body:
                                'Fiddly fun for all the family',
                            category: 'dexterity',
                            created_at: '2021-01-18T10:01:41.251Z',
                            votes: 5,
                            comment_count: '3',
                        });
                    });
            });
            test('ERROR non-existent valid id returns 404 not found', () => {
                return request(app)
                    .get('/api/reviews/999999')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('review_id not found');
                    });
            });
            test('ERROR invalid id returns 400 bad request', () => {
                return request(app)
                    .get('/api/reviews/epidemic')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe(
                            'bad request - review_id is not a number'
                        );
                    });
            });
            describe(`fetch comments by review_id`, () => {
                test('status 200, returns comments by review_id, with the most recent first', () => {
                    return request(app)
                        .get('/api/reviews/2/comments')
                        .expect(200)
                        .then(({ body }) => {
                            const { comments } = body;
                            expect(comments).toBeInstanceOf(Array);
                            expect(comments.length).toBe(3);
                            comments.forEach(comment => {
                                expect(comment).toEqual(
                                    expect.objectContaining({
                                        comment_id:
                                            expect.any(Number),
                                        body: expect.any(String),
                                        votes: expect.any(Number),
                                        author: expect.any(String),
                                        review_id: 2,
                                        created_at:
                                            expect.any(String),
                                    })
                                );
                            });
                            expect(comments).toBeSortedBy(
                                'created_at',
                                {
                                    descending: true,
                                }
                            );
                        });
                });
                test('status 200, returns empty body for review with no comments', () => {
                    return request(app)
                        .get('/api/reviews/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            const { comments } = body;
                            expect(comments).toBeInstanceOf(Array);
                            expect(comments.length).toBe(0);
                        });
                });
                test('ERROR non-existent review_id returns 404 not found', () => {
                    return request(app)
                        .get('/api/reviews/999999/comments')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe(
                                'review_id not found'
                            );
                        });
                });
                test('ERROR invalid review_id returns 400 bad request', () => {
                    return request(app)
                        .get('/api/reviews/epidemic/comments')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe(
                                'bad request - review_id is not a number'
                            );
                        });
                });
            });
        });
    });
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

describe(`PATCH /api`, () => {
    describe(`/reviews`, () => {
        describe(`/review_id`, () => {
            test(`/review_id for positive increase`, () => {
                const updateVote = { inc_votes: 7 };
                const updatedReview = {
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 12,
                };
                return request(app)
                    .patch(`/api/reviews/2`)
                    .send(updateVote)
                    .expect(202)
                    .then(({ body }) => {
                        const { review } = body;
                        expect(review).toEqual(updatedReview);
                    });
            });
            test(`/review_id for decrease`, () => {
                const updateVote = { inc_votes: -3 };
                const updatedReview = {
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 2,
                };
                return request(app)
                    .patch(`/api/reviews/2`)
                    .send(updateVote)
                    .expect(202)
                    .then(({ body }) => {
                        const { review } = body;
                        expect(review).toEqual(updatedReview);
                    });
            });
            test('ERROR non-existent review id returns 404 not found', () => {
                const updateVote = { inc_votes: 7 };
                return request(app)
                    .patch('/api/reviews/999999')
                    .send(updateVote)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('review_id not found');
                    });
            });
            test('ERROR invalid review id returns 400 bad request', () => {
                const updateVote = { inc_votes: 7 };
                return request(app)
                    .patch('/api/reviews/nine')
                    .send(updateVote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe(
                            'bad request - review_id is not a number'
                        );
                    });
            });
            test('ERROR invalid inc_votes returns 400 bad request', () => {
                const updateVote = { inc_votes: 'seven' };
                return request(app)
                    .patch('/api/reviews/2')
                    .send(updateVote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe(
                            'bad request - inc_votes is not a number'
                        );
                    });
            });
            test('ERROR votes should never be negative returns 400 bad request', () => {
                const updateVote = { inc_votes: -99 };
                return request(app)
                    .patch('/api/reviews/2')
                    .send(updateVote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe(
                            'bad request - total votes cannot be negative'
                        );
                    });
            });
            test('ERROR inc_votes has not been sent', () => {
                const updateVote = {};
                return request(app)
                    .patch('/api/reviews/2')
                    .send(updateVote)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe(
                            'bad request - inc_votes has not been sent'
                        );
                    });
            });
        });
    });
});
