const { collectingTopics, getEndpoints } = require("../models/models.js");

function getAllEndPoints(req, res, next) {
  getEndpoints().then((data) => {
    // console.log(data);
    res.status(200).send({ endpoints: data });
  });
}

function getTopics(req, res, next) {
  collectingTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
}

module.exports = { getTopics, getAllEndPoints };
