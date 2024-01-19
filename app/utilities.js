const db = require("../db/connection.js");

function checkArticleExists(article_id) {
  // return db
  //   .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
  //   .then(({ rows }) => {
  //     return rows;
  //   });

  return db
    .query(
      `SELECT * FROM articles
         WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: `Article ID doesn't currently exist`,
        });
      }
    });
}

module.exports = { checkArticleExists };
