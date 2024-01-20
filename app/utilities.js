const db = require("../db/connection.js");

function checkArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}
function checkCommentExists(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}
function checkValidId(id) {
  const validId = /[0-9]/;
  const testId = validId.test(id);
  if (!testId) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
}

module.exports = { checkArticleExists, checkCommentExists, checkValidId };
