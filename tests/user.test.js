const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const pool = require('../db');
 
describe('GET /users', () => {
   
    it('should return list of users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return list of users (paginated)', async () => {
        const limit = 5;
        const page = 1;

        const res = await request(app).get(`/users?limit=${limit}&page=${page}&sortBy=id&order=asc`);


        expect(res.statusCode).toBe(200);


        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body).toHaveProperty('perPage');
        expect(res.body).toHaveProperty('totalUsers');
        expect(res.body).toHaveProperty('totalPages');

        expect(Array.isArray(res.body.data)).toBe(true);


        expect(res.body.data.length).toBeLessThanOrEqual(limit);


        expect(res.body.currentPage).toBe(page);
        expect(res.body.perPage).toBe(limit);

        if (res.body.data.length > 0) {
            const user = res.body.data[0];
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
        }
    });

});


describe('GET /users', () => {
    it('should return list of users (paginated)', async () => {
        const token = jwt.sign(
            { id: 1, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const res = await request(app)
            .get('/users?limit=2&page=1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});


afterAll(async () => { await pool.end(); });

