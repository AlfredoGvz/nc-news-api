const request = require("supertest");
const { app } = require("../app/app.js");
const seed = require(`../db/seeds/seed.js`);
const testData = require(`../db/data/test-data/index.js`);
const db = require(`../db/connection.js`);

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(testData);
});

describe("App", () => {
  describe("/api", () => {
    describe("GET /topics", () => {
      test("Responds with a status of 200", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("Responds witn a 404 if path leads to somewthing that is not contained in the database", () => {
        return request(app).get("/api/topic").expect(404);
      });

      test("Respponds with an array of data", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
          });
      });
      test("Responds with the right properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const keys = Object.keys(body.topics[0]);
            expect(keys.includes("slug")).toBe(true);
            expect(keys.includes("description")).toBe(true);
          });
      });
    });
  });
});
