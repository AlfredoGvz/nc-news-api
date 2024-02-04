const articlesRouter = require("express").Router();
const {
  fetchArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
  updateArticleById,
} = require(`../app/controllers/controllers.js`);

articlesRouter.get("/", fetchArticles);
articlesRouter.get("/:article_id", fetchArticlesById);

articlesRouter.get("/:article_id/comments", fetchCommentsByArticleId);
articlesRouter.post("/:article_id/comments", addCommentToArticle);
articlesRouter.patch("/:article_id", updateArticleById);

module.exports = articlesRouter;
