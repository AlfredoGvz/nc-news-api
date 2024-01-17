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

function getArticlesById(article_id) {
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

module.exports = {
  collectingTopics,
  getEndpoints,
  getArticlesById,
  getArticles,
};
