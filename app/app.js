const express = require("express");
const {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
} = require(`./controllers/controllers.js`);
const { handle400s, handle500s } = require("./error-handler.js");

const app = express();

app.get("/api", fetchAllEndPoints);
app.get("/api/topics", fetchTopics);
app.get("/api/articles/:article_id", fetchArticlesById);

app.use(handle400s);

module.exports = { app };
