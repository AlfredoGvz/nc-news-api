const {
  collectingTopics,
  getEndpoints,
  getArticlesById,
  getArticles,
  getArticleComments,
  insertComment,
  updateArticle,
  deleteComment,
  getUsers,
  filteredArticles,
} = require("../models/models.js");
const { checkArticleExists } = require("../utilities.js");
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

function addCommentToArticle(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;
  if (!username || !body) {
    response.status(400).send({ msg: "Bad request" });
  }
  insertComment(article_id, username, body)
    .then((data) => {
      response.status(201).send({ comment: data });
    })
    .catch((err) => next(err));
}

function updateArticleById(request, response, next) {
  const { article_id } = request.params;
  const vote_update = request.body;

  updateArticle(article_id, vote_update)
    .then((data) => {
      response.status(200).send({ update: data });
    })
    .catch((err) => next(err));
}

function deleteCommentByCommentId(request, response, next) {
  const { comment_id } = request.params;

  deleteComment(comment_id)
    .then((result) => {
      response.status(200).send({ update: result });
    })
    .catch((err) => next(err));
}

function fetchUsers(request, response, next) {
  console.log("Am i here?");

  getUsers()
    .then((users) => {
      response.status(200).send({ users: users });
    })
    .catch((err) => next(err));
}

function filterArticlesByTopic(request, response, next) {
  const { topic } = request.query;

  filteredArticles(topic).then((filteredArticles) => {
    response.status(200).send({ filteredItems: filteredArticles });
  });
}

module.exports = {
  fetchTopics,
  fetchAllEndPoints,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
  updateArticleById,
  deleteCommentByCommentId,
  fetchUsers,
  filterArticlesByTopic,
};
