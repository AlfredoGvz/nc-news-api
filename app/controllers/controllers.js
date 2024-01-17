const {
  collectingTopics,
  getEndpoints,
  getArticlesById,
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

  getArticlesById(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
}

function fetchArticles(req, res, next) {
  getArticles()
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
  fetchArticles,
};
