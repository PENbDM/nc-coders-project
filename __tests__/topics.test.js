const request = require('supertest');
const db = require('../db/connection.js');
const app = require('../app.js');

describe('/api/topics', () => {
  describe('we have to get all topics with slug and description', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const res = await request(app).get('/api/topics');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(topic => {
        expect(topic).toHaveProperty('slug');
        expect(typeof topic.slug).toBe('string');

        expect(topic).toHaveProperty('description');
        expect(typeof topic.description).toBe('string');
      });
    });
  });
});

afterAll(async () => {
  await db.end();
});
