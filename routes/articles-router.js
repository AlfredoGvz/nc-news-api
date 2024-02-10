const articlesRouter = require("express").Router();
const {
  fetchArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentToArticle,
  updateArticleById,
  postArticle,
} = require(`../app/controllers/controllers.js`);

articlesRouter.get("/", fetchArticles);
articlesRouter.get("/:article_id", fetchArticlesById);

articlesRouter.get("/:article_id/comments", fetchCommentsByArticleId);

articlesRouter.post("/:article_id/comments", addCommentToArticle);
articlesRouter.post("/", postArticle);

articlesRouter.patch("/:article_id", updateArticleById);

module.exports = articlesRouter;
// afer  response arrow function
//afee anonymous arrow function
// afeea - arro function with arggument
//afpr
// ffc function declaration
// sfc arrow function
