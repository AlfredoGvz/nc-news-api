const request = require("supertest");
const { app } = require("../app/app.js");
const seed = require(`../db/seeds/seed.js`);
const testData = require(`../db/data/test-data/index.js`);
const db = require(`../db/connection.js`);
const articles = require(`../db/data/test-data/articles`);
const fs = require("fs/promises");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(testData);
});

describe("App", () => {
  describe("/api", () => {
    describe("GET /topics", () => {
      test("200 - Responds with a status of 200.", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("200- Respponds with an array of data.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
          });
      });
      test("200- The array of data contains objects holding all the right properties.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            body.topics.forEach((element) => {
              let objKeys = Object.keys(element);
              expect(objKeys.includes("slug")).toBe(true);
              expect(objKeys.includes("description")).toBe(true);
            });
          });
      });
      test("404- Responds with a 404 if path leads to something non-exiastent in the database.", () => {
        return request(app).get("/api/tsopic").expect(404);
      });
    });
    describe("GET /api", () => {
      test("200- Response returns an object holding information about the different valid enpoints.", () => {
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
    //Challenge 4
    describe("GET /api/articles/:article_id", () => {
      test("200- Responds with an article array holding the all the right properties.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            Object.keys(body.article[0]).includes("article_id");
            Object.keys(body.article[0]).includes("title");
            Object.keys(body.article[0]).includes("topic");
            Object.keys(body.article[0]).includes("author");
            Object.keys(body.article[0]).includes("body");
            Object.keys(body.article[0]).includes("created_at");
            Object.keys(body.article[0]).includes("votes");
            Object.keys(body.article[0]).includes("article_img_url");
          });
      });
      test("200- Responds with an array of articles holding the right information.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).toEqual(
              expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
            );
          });
      });
      test('404 - Providing an id for an non-existent article, responds with a "Not found" message.', () => {
        return request(app)
          .get("/api/articles/19")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });

    //Task 5

    describe("GET /api/articles", () => {
      test("200- Responds with an array of data.", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
          });
      });
      test("200- The array of data contains objects holding all the right properties.", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((item) => {
              let objKeys = Object.keys(item);
              expect(objKeys.includes("author")).toBe(true);
              expect(objKeys.includes("title")).toBe(true);
              expect(objKeys.includes("article_id")).toBe(true);
              expect(objKeys.includes("topic")).toBe(true);
              expect(objKeys.includes("created_at")).toBe(true);
              expect(objKeys.includes("votes")).toBe(true);
              expect(objKeys.includes("article_img_url")).toBe(true);
              expect(objKeys.includes("comment_count")).toBe(true);
            });
          });
      });
      test("404- Responds with a 'Not found' message.", () => {
        return request(app)
          .get("/api/aerticless")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
  });
});
