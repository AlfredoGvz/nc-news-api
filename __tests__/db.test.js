const request = require("supertest");
const { app } = require("../app/app.js");
const seed = require(`../db/seeds/seed.js`);
const testData = require(`../db/data/test-data/index.js`);
const db = require(`../db/connection.js`);
const fs = require("fs/promises");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(testData);
});

// console.log(whatComesBack());
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
            body.topics.forEach((element) => {
              let objKeys = Object.keys(element);
              if (objKeys.length > 0) {
                expect(objKeys.includes("slug")).toBe(true);
                expect(objKeys.includes("description")).toBe(true);
              }
            });
          });
      });
    });
  });

  describe("GET /api", () => {
    test("Response returns an object", () => {
      //Edit this test description
      return fs
        .readFile(`endpoints.json`, "utf-8")
        .then((data) => {
          return JSON.parse(data);
        })
        .then((data) => {
          return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
              expect(body.endpoints).toEqual(data);
            });
        });
    });
  });
});
