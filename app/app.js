const express = require("express");
const {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
} = require(`./controllers/controllers.js`);

const app = express();

app.use(express.json());

app.get("/api", fetchAllEndPoints);
app.get("/api/topics", fetchTopics);
app.get("/api/articles/:article_id", fetchArticlesById);
app.get("/api/articles", fetchArticles);
app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addCommentToArticle);

//================================================//

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

//custom errors
app.use((err, req, res, next) => {
  console.log(err, "<<<<404 CUSTOM ERROR");
  if (err.status === 404) {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err, "<<< 400 CUSTOM ERROR");

  if (err.status === 400) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

//POSTGRES ERRORS
app.use((err, req, res, next) => {
  console.log(err, "<<< 404 POSTGRES");
  if (err.code === 23503) {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "<<< 500 CUSTOM ERROR");
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = { app };
