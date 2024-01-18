const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");

describe("/api/users", () => {
  describe("GET /api/users", () => {
    test("200: status code and contain the expected data type and fields", async () => {
      const res = await request(app).get("/api/users");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((user) => {
        expect(typeof user.username).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
      });
    });
    test("Handles invalid URL or route", async () => {
      const res = await request(app).get("/api/invalidroute");
      expect(res.statusCode).toBe(404);
    });
  });
});