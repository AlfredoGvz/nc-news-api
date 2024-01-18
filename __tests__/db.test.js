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
    describe("GET /api/topics", () => {
      test("200- Responds with a status of 200.", () => {
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

    //Challenge 4
    describe("GET /api/articles/:article_id", () => {
      test("200- Responds with an array of articles holding the right information.", () => {
        const article = {
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).toHaveProperty("article_id");
            expect(body.article[0]).toHaveProperty("title");
            expect(body.article[0]).toHaveProperty("topic");
            expect(body.article[0]).toHaveProperty("author");
            expect(body.article[0]).toHaveProperty("body");
            expect(body.article[0]).toHaveProperty("created_at");
            expect(body.article[0]).toHaveProperty("votes");
            expect(body.article[0]).toHaveProperty("article_img_url");

            expect(body.article[0]).toMatchObject(article);
          });
      });
      test('404- Providing an id for an non-existent article, responds with a "Not found" message.', () => {
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
              expect(item).toHaveProperty("article_id", expect.any(Number));
              expect(item).toHaveProperty("title", expect.any(String));
              expect(item).toHaveProperty("topic", expect.any(String));
              expect(item).toHaveProperty("author", expect.any(String));
              expect(item).toHaveProperty("created_at", expect.any(String));
              expect(item).toHaveProperty("votes", expect.any(Number));
              expect(item).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(item).toHaveProperty("comment_count");
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
    //Task 6
    describe("GET /api/articles/:article_id/comments", () => {
      test("200- Responds with an array of data.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
          });
      });
      test("200- The array of data contains objects holding all the right properties.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            body.comments.forEach((comment) => {
              let objKeys = Object.keys(comment);
              expect(objKeys.includes("comment_id")).toBe(true);
              expect(objKeys.includes("votes")).toBe(true);
              expect(objKeys.includes("created_at")).toBe(true);
              expect(objKeys.includes("author")).toBe(true);
              expect(objKeys.includes("body")).toBe(true);
              expect(objKeys.includes("article_id")).toBe(true);
            });
          });
      });
      test("200- Responds with an array of data sorted by date.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      test("400- Responds with a message of 'Bad request' when query is not valid.", () => {
        return request(app)
          .get("/api/articles/bad_request/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("404- Responds with a message of 'Not found' acessing an item non-existent in the database.", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
    //Task 7
    describe("POST /api/articles/:article_id/comments", () => {
      test("201- Responds with the posted comment.", () => {
        const newComment = {
          body: "I suck at coding",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            const comment = body.comment[0];
            expect(body.comment).toBeInstanceOf(Array);
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: newComment.body,
              article_id: 2,
              author: newComment.username,
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
      });
    });
  });
});
