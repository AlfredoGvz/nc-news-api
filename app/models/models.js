const db = require("../../db/connection.js");
const { checkArticleExists, checkCommentExists } = require("../utilities.js");
const fs = require("fs/promises");
const format = require("pg-format");
const emailjs = require("@emailjs/browser");
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
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = $1 
GROUP BY articles.article_id;`,
      //Count comments was returning a string value, so we cast it to parse it to a number
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}

function getArticles(topic, order_by = "created_at", order = "DESC") {
  const queryValues = [];
  const validSortingQueries = [
    "title",
    "author",
    "created_at",
    "comment_count",
  ];
  if (
    !validSortingQueries.includes(order_by) ||
    !order.match(/^(DESC|ASC)$/i)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sorting criteria. Please use a valid column name and ASC or DESC order.",
    });
  }
  let queryString = `SELECT 
      articles.article_id,
      articles.title, 
      articles.topic,
      articles.author,
      articles.created_at, 
      articles.votes,
      articles.article_img_url, 
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count
      FROM articles 
      LEFT JOIN comments ON 
      articles.article_id = comments.article_id`;

  // Conditionally add WHERE clause
  if (topic) {
    queryString += ` WHERE articles.topic=$1`;
    queryValues.push(topic);
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${order_by} ${order} LIMIT 10 OFFSET 2+1`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
}

//6-get-comments-by-article
function getArticleComments(article_id) {
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

function updateArticle(article_id, vote_update) {
  const updateValue = vote_update.inc_votes;
  return db
    .query(
      `UPDATE articles SET votes = votes+$1 WHERE article_id=$2 RETURNING *`,
      [updateValue, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      console.log(rows);
      return rows;
    });
}

async function deleteComment(comment_id) {
  const checkData = await checkCommentExists(comment_id);
  if (checkData.length !== 0) {
    return db
      .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
      .then(({ rows }) => {
        return rows;
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
}

function getUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function getUsersByUsername(username) {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows;
    });
}

function insertNewPost(body) {
  if (!body.title) {
    return Promise.reject({ status: 400, msg: "Missing article title" });
  } else if (!body.topic) {
    return Promise.reject({ status: 400, msg: "Missing article topic" });
  } else if (!body.author) {
    return Promise.reject({ status: 400, msg: "Missing article author" });
  } else if (!body.body) {
    return Promise.reject({ status: 400, msg: "Missing article body" });
  } else if (!body.article_img_url) {
    return Promise.reject({ status: 400, msg: "Missing article image url" });
  }
  return db
    .query(
      format(
        `
    INSERT INTO articles 
    (title, topic, author, body, article_img_url)
    VALUES %L
    RETURNING *`,
        [[body.title, body.topic, body.author, body.body, body.article_img_url]]
      )
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
    });
}
function postMessage(senderEmail, senderName, emailSubject, message) {
  console.log(senderEmail, senderName, emailSubject, message);

  const service_id = process.env.REACT_APP_SERVICE_ID;
  const template_id = process.env.REACT_APP_TEMPLATE_ID;
  const user_id = process.env.REACT_APP_USER_ID;
  const public_key = process.env.REACT_APP_PUBLIC_KEY;
  const templateParams = {
    to_name: "Alfredo",
    from_name: senderName,
    from_email: senderEmail,
    message: message,
    subject: emailSubject,
  };
  console.log(service_id);
  emailjs
    .send(service_id, template_id, templateParams, public_key)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  collectingTopics,
  getEndpoints,
  getArticlesById,
  getArticles,
  getArticleComments,
  insertComment,
  updateArticle,
  deleteComment,
  getUsers,
  getUsersByUsername,
  insertNewPost,
  postMessage,
};
