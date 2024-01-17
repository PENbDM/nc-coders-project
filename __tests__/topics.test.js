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

describe('/api/articles:/article_id', () => {
  describe('GET /api/articles/:article_id', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const res = await request(app).get(`/api/articles/33`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(article => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
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
    });
    test('400: when passing wrong type of id', async () => {
      const res = await request(app).get('/api/articles/asdasd');
      expect(res.statusCode).toBe(400);
    });

    test('404: when passing a non-existent id', async () => {
      const res = await request(app).get(`/api/articles/44444`);
      expect(res.statusCode).toBe(404);
    });
  });
});



describe('/api/articles', () => {
  describe('GET /api/articles', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const res = await request(app).get(`/api/articles`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(article => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String), 
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String)
          })
        );
      });
    })
  });
});


describe('/api/articles/:article_id/comments', () => {
  describe('GET /api/articles/2/comments', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const res = await request(app).get(`/api/articles/2/comments`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(comment => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
    });
    test('400: when passing wrong type of id', async () => {
      const res = await request(app).get('/api/articles/asdasd/comments');
      expect(res.statusCode).toBe(400);
    });

    test('404: when passing a non-existent id', async () => {
      const res = await request(app).get(`/api/articles/44444/comments`);
      expect(res.statusCode).toBe(404);
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('POST /api/articles/1/comments', () => {
    test('201: status code and contain the expected data type and fields', async () => {
      const newComment = {
        username: 'dimatest',
        body: 'testtesttesttest',
      };
      const res = await request(app)
        .post('/api/articles/1/comments') 
        .send(newComment);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          body: newComment.body,
          article_id: 1,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        })
      );
    });

    test('400: when missing username or body', async () => {
      const res = await request(app)
        .post('/api/articles/1/comments') 
        .send({}); 

      expect(res.statusCode).toBe(400);
    });

  });
});


describe('/api/articles/:article_id', () => {
  describe('PATCH /api/articles/:article_id', () => {
    test('200: status code and contain the expected data type and fields', async () => {
      const updateData = {
        inc_votes: 5,
      };

      const existingArticleId = 1;

      const res = await request(app)
        .patch(`/api/articles/${existingArticleId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          article: expect.objectContaining({
            article_id: existingArticleId,
            votes: expect.any(Number),
          }),
        })
      );
    });

    test('400: when missing or invalid article_id', async () => {
      const updateData = {
        inc_votes: 5,
      };

      const res = await request(app)
        .patch('/api/articles/invalidId')
        .send(updateData);

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid or missing article_id")
    });
    test('400: when missing or invalid inc_votes', async () => {
      const updateData = {
      };

      const res = await request(app)
        .patch('/api/articles/4')
        .send(updateData);

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid or missing inc_votes")
    });

    test('404: when passing a non-existent article_id', async () => {
      const updateData = {
        inc_votes: 5,
      };

      const nonExistentArticleId = 999;

      const res = await request(app)
        .patch(`/api/articles/${nonExistentArticleId}`)
        .send(updateData);
      expect(res.statusCode).toBe(404);
      expect(res.body.msg).toBe("Article not found")

    });
  });
});


afterAll(async () => {
  await db.end();
});
