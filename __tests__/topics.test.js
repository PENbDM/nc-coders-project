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

describe('/api/articles', () => {
  describe('GET /api/articles/:article_id', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const article_id = 33;
      const res = await request(app).get(`/api/articles/${article_id}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const article = res.body[0]; 
      expect(article).toEqual(
        expect.objectContaining({
          article_id: article_id,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
      );
    });
    test('400: when passing wrong type of id', async () => {
      const res = await request(app).get('/api/articles/asdasd');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid or missing article_id")
    });

    test('404: when passing a non-existent id', async () => {
      const res = await request(app).get(`/api/articles/44444`);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe( "Article not found")
    });
  });
});



















afterAll(async () => {
  await db.end();
});
