const usersRouter = require("express").Router();
const {
  fetchUsers,
  fetchUsersByUsername,
} = require(`../app/controllers/controllers`);

usersRouter.get("/", fetchUsers);
usersRouter.get("/:username", fetchUsersByUsername);

module.exports = usersRouter;
