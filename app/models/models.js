const db = require("../../db/connection.js");
const fs = require("fs/promises");

function getEndpoints() {
  return fs.readFile("endpoints.json", "utf-8").then((info) => {
    return JSON.parse(info);
  });
}

function collectingTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

function getArticles() {}
module.exports = { collectingTopics, getEndpoints, getArticles };
