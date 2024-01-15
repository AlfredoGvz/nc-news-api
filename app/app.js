const express = require("express");
const {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
} = require(`./controllers/controllers.js`);

const app = express();

app.get("/api", fetchAllEndPoints);
app.get("/api/topics", fetchTopics);
app.get("/api/articles/:article_id", fetchArticlesById);

module.exports = { app };
