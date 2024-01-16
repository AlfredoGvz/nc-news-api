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

function getArticles(article_id) {
  return db
    .query(
      `SELECT * FROM articles
       WHERE article_id = ${article_id}`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}

module.exports = { collectingTopics, getEndpoints, getArticles };
