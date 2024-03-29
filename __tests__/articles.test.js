const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/development-data/index.js')
beforeEach(() => {
  return seed(testData);
});

afterAll(()=>{
  return db.end()
})

describe("/api/articles:/article_id", () => {
    describe("GET /api/articles/:article_id", () => {
      test("200: status code and contain the expected data type and fields", async () => {
        const id = 33;
        const res = await request(app).get(`/api/articles/${id}`);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object'); 
        const article = res.body;
        expect(article.article_id).toBe(id)
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
          comment_count: expect.any(String), 
            })
          );
        });
        
        test("400: when passing wrong type of id", async () => {
            const res = await request(app).get("/api/articles/asdasd");
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid article_id')
          });
      
          test("404: when passing a non-existent id", async () => {
            const res = await request(app).get(`/api/articles/44444`);
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Article not found")
          });
      });
  });


  describe("/api/articles", () => {
    describe("GET /api/articles", () => {
      test("200: status code and contain the expected data type and fields", async () => {
        const res = await request(app).get(`/api/articles`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
    });
  });
  

  describe("/api/articles/:article_id/comments", () => {
    describe("GET /api/articles/2/comments", () => {
      test("200: status code and contain the expected data type and fields", async () => {
        const res = await request(app).get(`/api/articles/2/comments`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((comment) => {
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
      test("400: when passing wrong type of id", async () => {
        const res = await request(app).get("/api/articles/asdasd/comments");
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid article_id")
      });
  
      test("404: when passing a non-existent id", async () => {
        const res = await request(app).get(`/api/articles/44444/comments`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Article not found")
      });
    });
  });


  describe("/api/articles/:article_id/comments", () => {
    describe("POST /api/articles/1/comments", () => {
      test("201: status code and contain the expected data type and fields", async () => {
        const newComment = {
          username: "cooljmessy",
          body: "testtesttesttest",
        };
        const res = await request(app)
          .post("/api/articles/1/comments")
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
  
      test("400: when missing username or body", async () => {
        const res = await request(app).post("/api/articles/1/comments").send({
         
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing username or body")
      });

      test("400: when username does not exist", async () => {
        const res = await request(app).post("/api/articles/1/comments").send({
          username:'dima',
          body:'sdsdsd'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("User with the provided username does not exist")
      });

      test("400: when article does not exist", async () => {
        const article_id = 99999;
        const res = await request(app).post(`/api/articles/${article_id}/comments`).send({
          username:'cooljmessy',
          body:'sdsdsd'
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe(`Article with id ${article_id} does not exist`)
      });
    });
  });


  describe("/api/articles/:article_id", () => {
    describe("PATCH /api/articles/:article_id", () => {
      test("200: status code and contain the expected data type and fields", async () => {
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
      test("400: when missing or invalid article_id", async () => {
        const updateData = {
          inc_votes: 5,
        };
        const res = await request(app)
          .patch("/api/articles/invalidId")
          .send(updateData);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Missing article_id");
      });
      test("400: when missing or invalid inc_votes", async () => {
        const updateData = {};
        const res = await request(app).patch("/api/articles/4").send(updateData);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid or missing inc_votes");
      });
      test("404: when passing a non-existent article_id", async () => {
        const updateData = {
          inc_votes: 5,
        };
        const nonExistentArticleId = 999;
        const res = await request(app)
          .patch(`/api/articles/${nonExistentArticleId}`)
          .send(updateData);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article not found");
      });
    });
  });






  describe("/api/comments/:comment_id", () => {
    describe("DELETE /api/comments/:comment_id", () => {
      test("204: when deleting a valid comment", async () => {
        const validCommentId =10;
        const res = await request(app).delete(`/api/comments/${validCommentId}`);
        expect(res.statusCode).toBe(204);
        expect(res.body).toEqual({});
      });
      test("400: when missing or invalid comment_id", async () => {
        const invalidCommentId = "invalidId";
        const res = await request(app).delete(
          `/api/comments/${invalidCommentId}`
        );
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          status: 400,
          msg: "Invalid or missing comment_id",
        });
      });
      test("404: when deleting a non-existent comment", async () => {
        const nonExistentCommentId = 999;
        const res = await request(app).delete(
          `/api/comments/${nonExistentCommentId}`
        );
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
          status: 404,
          msg: "Comment not found",
        });
      });
    });
  });


  describe("GET /api/articles with topic query", () => {
    test("200: should return articles filtered by topic", async () => {
      const topic = "football";
  
      const res = await request(app).get(`/api/articles?topic=${topic}`);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      res.body.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: topic,
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
    });
    test("200: when no passing topic, get all articles ", async () => {
      const topic = "";
      const res = await request(app).get(`/api/articles?topic=${topic}`);
      expect(res.statusCode).toBe(200);
    });
    test("404: when passing a non-existent topic", async () => {
      const nonExistentTopic = "foot";
      const res = await request(app).get(
        `/api/articles?topic=${nonExistentTopic}`
      );
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe(
        `Article with ${nonExistentTopic} topic not found`
      );
    });
  });
  