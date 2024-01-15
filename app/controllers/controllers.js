const {
  collectingTopics,
  getEndpoints,
  getArticles,
} = require("../models/models.js");

function fetchAllEndPoints(req, res, next) {
  getEndpoints().then((data) => {
    // console.log(data);
    res.status(200).send({ endpoints: data });
  });
}

function fetchTopics(req, res, next) {
  collectingTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
}

function fetchArticlesById(req, res, next) {}

module.exports = { fetchTopics, fetchAllEndPoints, fetchArticlesById };
