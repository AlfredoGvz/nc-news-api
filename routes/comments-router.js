const commentsRouter = require("express").Router();

const {
  deleteCommentByCommentId,
} = require(`../app/controllers/controllers.js`);

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;
