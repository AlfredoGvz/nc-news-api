const {
  collectingTopics,
  getEndpoints,
  getArticles,
} = require("../models/models.js");

function fetchAllEndPoints(req, res, next) {
  getEndpoints().then((data) => {
    res.status(200).send({ endpoints: data });
  });
}

function fetchTopics(req, res, next) {
  collectingTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
}

function fetchArticlesById(req, res, next) {
  const { article_id } = req.params;

  getArticles(article_id)
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch(next);
}

module.exports = { fetchTopics, fetchAllEndPoints, fetchArticlesById };
