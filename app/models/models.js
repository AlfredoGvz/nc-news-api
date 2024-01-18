const db = require("../../db/connection.js");
const { checkArticleExists } = require("../utilities.js");
const fs = require("fs/promises");
const format = require("pg-format");

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

function getArticlesById(article_id) {
  return db
    .query(
      `SELECT * FROM articles
       WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}

function getArticles() {
  return db
    .query(
      `SELECT 
      articles.article_id,
      articles.title, 
      articles.topic,
      articles.author,
      articles.created_at, 
      articles.votes,
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON 
      articles.article_id = comments.article_id 
      GROUP BY articles.article_id`
    )
    .then(({ rows }) => {
      return rows;
    });
}

//6-get-comments-by-article
function getArticleComments(article_id) {
  //Deal with this later
  const validId = /[0-9]/;
  const testId = validId.test(article_id);
  if (!testId) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at ASC
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}

async function insertComment(article_id, username, body) {
  const checkArticle = await checkArticleExists(article_id);
  if (checkArticle) {
    const queryValue = format(
      `INSERT INTO comments
        (body, article_id, author)
        VALUES
        %L
        RETURNING *;
       `,
      [[body, article_id, username]]
    );
    return db.query(queryValue).then(({ rows }) => {
      return rows;
    });
  }
}

module.exports = {
  collectingTopics,
  getEndpoints,
  getArticlesById,
  getArticles,
  getArticleComments,
  insertComment,
};
