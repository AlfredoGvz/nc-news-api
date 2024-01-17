const {
  collectingTopics,
  getEndpoints,
  getArticlesById,
  getArticles,
  getArticleComments,
} = require("../models/models.js");

function fetchAllEndPoints(request, response, next) {
  getEndpoints().then((data) => {
    response.status(200).send({ endpoints: data });
  });
}

function fetchTopics(request, response, next) {
  collectingTopics().then((data) => {
    response.status(200).send({ topics: data });
  });
}

function fetchArticlesById(request, response, next) {
  const { article_id } = request.params;

  getArticlesById(article_id)
    .then((data) => {
      response.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
}

function fetchArticles(request, response, next) {
  getArticles()
    .then((data) => {
      response.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
}

function fetchCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  getArticleComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => next(err));
}
module.exports = {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
};
