const db = require("../../db/connection.js");

function collectingTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { collectingTopics };
