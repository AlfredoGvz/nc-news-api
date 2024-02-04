const apiRouter = require("express").Router();
const { fetchAllEndPoints } = require("../app/controllers/controllers");

apiRouter.get("/", fetchAllEndPoints);

module.exports = apiRouter;
