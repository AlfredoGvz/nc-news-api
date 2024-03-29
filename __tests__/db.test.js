const request = require("supertest");
const { app } = require("../app.js");
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
            expect(body.topics).toBeInstanceOf(Array);
          });
      });
      test("200- The array of data contains objects holding all the right properties.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            body.topics.forEach((element) => {
              expect(element).toHaveProperty("slug", expect.any(String));
              expect(element).toHaveProperty("description", expect.any(String));
            });
          });
      });
      test("404- Responds with a 'Not found' if accessed a wrong enpoint", () => {
        return request(app)
          .get("/api/tsopic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
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
          comment_count: 11,
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
            expect(body.article[0]).toHaveProperty("comment_count");

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
      test("400- Responds with a message of 'Bad request' when query uses a non-valid article id.", () => {
        return request(app)
          .get("/api/articles/bananas")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    //Ticket 5
    describe("GET /api/articles", () => {
      test("200- Responds with an array of data (Ticket 5).", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeInstanceOf(Array);
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
      test("404- Responds with a 'Not found' message when accessing an endpoint to an unexistent piece of data in databse.", () => {
        return request(app)
          .get("/api/aerticless")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
    //Ticket 6
    describe("GET /api/articles/:article_id/comments", () => {
      test("200- Responds with an array of data.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
          });
      });
      test("200- The array of data contains objects holding all the right properties.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            body.comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id", expect.any(Number));
              expect(comment).toHaveProperty("votes", expect.any(Number));
              expect(comment).toHaveProperty("created_at", expect.any(String));
              expect(comment).toHaveProperty("author", expect.any(String));
              expect(comment).toHaveProperty("body", expect.any(String));
              expect(comment).toHaveProperty("article_id", expect.any(Number));
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
      test("404- Responds with a message of 'Not found' acessing an item non-existent in the database.", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
      test("400- Responds with a message of 'Bad request' when query uses a non-valid article id.", () => {
        return request(app)
          .get("/api/articles/bad_request/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    //Ticket 7
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
      test("404- Responds with a 'Not found' message given a non-existen article in databse.", () => {
        const newComment = {
          body: "I suck at coding",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/200/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
      test("400- Responds with a 'Bad request' message if request does not include username.", () => {
        const newComment = {
          body: "I suck at coding",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("400- Responds with a 'Bad request' message if request does not include body.", () => {
        const newComment = {
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    //Ticket 8
    describe("PATCH /api/articles/:article_id", () => {
      test("200- Responds with the updated information.", () => {
        return request(app)
          .patch("/api/articles/7")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            const update = body.update;
            expect(update).toBeInstanceOf(Array);
            expect(update[0]).toMatchObject({
              article_id: 7,
              title: "Z",
              topic: "mitch",
              author: "icellusedkars",
              body: "I was hungry.",
              created_at: "2020-01-07T14:08:00.000Z",
              votes: 1,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("404- Responds with 'Not found' given the accessed article does not exist.", () => {
        return request(app)
          .patch("/api/articles/99")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
      test("400- Responds with a message of 'Bad request' when query uses a non-valid article id.", () => {
        return request(app)
          .patch("/api/articles/bananas")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    // Ticket 9
    describe("DELETE /api/comments/:comment_id", () => {
      test("200- Responds with the deleted item.", () => {
        /*a 204 status code indicates "No Content,"
         which explicitly states there shouldn't be a body in the response.
         If you need to return data, use a different status code like 200 (OK).*/
        return request(app)
          .delete("/api/comments/9")
          .expect(200)
          .then(({ body }) => {
            expect(body.update).toBeInstanceOf(Array);
            expect(body.update).toEqual([]);
          });
      });
      test("404- Responds with 'Not found' if comment does not exist.", () => {
        return request(app)
          .delete("/api/comments/9000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
      test("400- Responds with a message of 'Bad request' when query uses a non-valid comment id. ", () => {
        return request(app)
          .delete("/api/comments/bad_id_input")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    //Ticket 10
    describe("GET /api/users", () => {
      test("200- Responds with an array of data.", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const users = body.users;
            expect(users).toBeInstanceOf(Array);
          });
      });
      test("200- Responds with an array of data containing objects holding the right information.", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const users = body.users;
            users.forEach((user) => {
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("name", expect.any(String));
              expect(user).toHaveProperty("avatar_url", expect.any(String));
            });
          });
      });
      test("404- Responds with a 'Not found' message given a non-existen article in databse.", () => {
        return request(app)
          .get("/api/not_right_endpoint")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });

    //ticket 11
    describe("GET /api/articles?topic=query_val", () => {
      /*
      This query is linked to the fetchArticles() controller on line 38
      */
      test("200- Responds with an array of data.", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const users = body.articles;
            expect(users).toBeInstanceOf(Array);
          });
      });
      test("200- Filters out items specified by the query.", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.every((article) => article.topic === "mitch");
          });
      });

      test("404- returns a 'Not found' message if value of query is not contained in the database.", () => {
        return request(app)
          .get("/api/articles?topic=elemental_variable")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
    describe("GET /api/articles?topic=query_val&sort_by=query_val", () => {
      //Data validation - structure & content -> mergued two tests in one.
      test("200- Responds with an array containing the right properties and data type.", () => {
        return request(app)
          .get("/api/articles?topic=mitch&order_by=comment_count&order=ASC")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("topic", expect.any(String));
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      //Data validation - structure & content -> ordered by...
      test("200- Responds with an array of filtered and sorted data.", () => {
        return request(app)
          .get("/api/articles?topic=mitch&order_by=comment_count&order=ASC")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("comment_count", {
              descending: false,
            });
          });
      });
      //Data validation - structure and content -> default values to sort and order.
      test("200- Responds with an array of filtered and sorted data.", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      //Null/Empty Handling
      test("400- Returns a 'Bad request' message when querying using invalid values", () => {
        return request(app)
          .get("/api/articles?topic=mitch&order_by=not_valid&order=not_valid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Invalid sorting criteria. Please use a valid column name and ASC or DESC order."
            );
          });
      });
    });
    describe("GET /api/users/:username", () => {
      test("200- Returns an array of data.", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toBeInstanceOf(Array);
          });
      });
      test("200- Returns an array containing the right data.", () => {
        const user = {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        };

        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user[0]).toHaveProperty("username");
            expect(body.user[0]).toHaveProperty("name");
            expect(body.user[0]).toHaveProperty("avatar_url");
            expect(body.user[0]).toEqual(user);
          });
      });
      test("404- Returns a message of 'User not found' if user does not exist", () => {
        return request(app)
          .get("/api/users/i_don't_exist_:D")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User not found");
          });
      });
    });
    describe("POST /api/articles", () => {
      test("200- Successful request returns an array of data containing the onject with information posted.", () => {
        const articlePost = {
          title: "100 reasons to watch anime",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well, for one, anime is good. For 99, anime is really good.",
          article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(201)
          .then(({ body }) => {
            expect(body.post[0]).toMatchObject({
              article_id: expect.any(Number),
              title: "100 reasons to watch anime",
              topic: "mitch",
              author: "butter_bridge",
              body: "Well, for one, anime is good. For 99, anime is really good.",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
            });
          });
      });
      test("400- Returns a message that article title is missing.", () => {
        const articlePost = {
          title: null,
          topic: "mitch",
          author: "butter_bridge",
          body: "Well, for one, anime is good. For 99, anime is really good.",
          article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(400)
          .then(({ body }) => {
            // console.log(body.post[0]);
            expect(body.msg).toBe("Missing article title");
          });
      });
      test("400- Returns a message that article topic is missing.", () => {
        const articlePost = {
          title: "100 reasons to watch anime",
          topic: null,
          author: "butter_bridge",
          body: "Well, for one, anime is good. For 99, anime is really good.",
          article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(400)
          .then(({ body }) => {
            // console.log(body.post[0]);
            expect(body.msg).toBe("Missing article topic");
          });
      });
      test("400- Returns a message that article author is missing.", () => {
        const articlePost = {
          title: "100 reasons to watch anime",
          topic: "mitch",
          author: null,
          body: "Well, for one, anime is good. For 99, anime is really good.",
          article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(400)
          .then(({ body }) => {
            // console.log(body.post[0]);
            expect(body.msg).toBe("Missing article author");
          });
      });
      test("400- Returns a message that article body is missing.", () => {
        const articlePost = {
          title: "100 reasons to watch anime",
          topic: "mitch",
          author: "butter_bridge",
          body: null,
          article_img_url: "https://wallpapercave.com/wp/iESNQzi.jpg",
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(400)
          .then(({ body }) => {
            // console.log(body.post[0]);
            expect(body.msg).toBe("Missing article body");
          });
      });
      test("400- Returns a message that article image url is missing.", () => {
        const articlePost = {
          title: "100 reasons to watch anime",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well, for one, anime is good. For 99, anime is really good.",
          article_img_url: null,
        };
        return request(app)
          .post("/api/articles")
          .send(articlePost)
          .expect(400)
          .then(({ body }) => {
            // console.log(body.post[0]);
            expect(body.msg).toBe("Missing article image url");
          });
      });
    });
  });
});
