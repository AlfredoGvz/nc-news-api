const { collectingTopics } = require("../models/models.js");

function getTopics(req, res, next) {
  collectingTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
}

module.exports = { getTopics };
