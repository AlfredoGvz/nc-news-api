const express = require("express");
const {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
  fetchArticles,
} = require(`./controllers/controllers.js`);

const app = express();

app.get("/api", fetchAllEndPoints);
app.get("/api/topics", fetchTopics);
app.get("/api/articles/:article_id", fetchArticlesById);
app.get("/api/articles", fetchArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

//custom errors
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = { app };
