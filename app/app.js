const express = require("express");
const { getTopics, getAllEndPoints } = require(`./controllers/controllers.js`);

const app = express();

app.get("/api", getAllEndPoints);
app.get("/api/topics", getTopics);

module.exports = { app };
