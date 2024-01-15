const db = require("../../db/connection.js");
const fs = require("fs/promises");

function getEndpoints() {
  return fs
    .readFile(
      "/home/natsu/Documents/northcoders/07-week-seven-backendPT3/01-monday/nc-news-api/be-nc-news/endpoints.json",
      "utf-8"
    )
    .then((info) => {
      return JSON.parse(info);
    });
}

function collectingTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { collectingTopics, getEndpoints };
