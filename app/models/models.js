const db = require("../../db/connection.js");

function getEndpoints() {
  return db.query(`SHOW TABLES`).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
}

function collectingTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { collectingTopics, getEndpoints };
