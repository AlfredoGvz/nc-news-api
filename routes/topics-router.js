const topicsRouter = require("express").Router();
const { fetchTopics } = require(`../app/controllers/controllers`);
topicsRouter.get("/", fetchTopics);

module.exports = topicsRouter;
