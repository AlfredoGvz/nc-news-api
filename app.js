const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const apiRouter = require("./routes/api-router.js");
const usersRouter = require("./routes/users-router.js");
const topicsRouter = require("./routes/topics-router.js");
const articlesRouter = require("./routes/articles-router.js");
const commentsRouter = require("./routes/comments-router.js");
const { sendEmail } = require("./app/controllers/controllers.js");

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api", apiRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.post("/api/contact", sendEmail);

//================================================//

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

//custom errors
app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "User not found") {
    res.status(404).send({ msg: "User not found" });
  } else if (err.status === 404 && err.msg === "Not found") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (
    err.status === 400 &&
    err.msg ===
      "Invalid sorting criteria. Please use a valid column name and ASC or DESC order."
  ) {
    res.status(400).send({
      msg: "Invalid sorting criteria. Please use a valid column name and ASC or DESC order.",
    });
  } else if (err.status === 400 && err.msg === "Missing article title") {
    res.status(400).send({ msg: "Missing article title" });
  } else if (err.status === 400 && err.msg === "Missing article topic") {
    res.status(400).send({ msg: "Missing article topic" });
  } else if (err.status === 400 && err.msg === "Missing article author") {
    res.status(400).send({ msg: "Missing article author" });
  } else if (err.status === 400 && err.msg === "Missing article body") {
    res.status(400).send({ msg: "Missing article body" });
  } else if (err.status === 400 && err.msg === "Missing article image url") {
    res.status(400).send({ msg: "Missing article image url" });
  } else {
    next(err);
  }
});
//POSTGRES ERRORS
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res
      .status(400)
      .send({ msg: "Make sure you are using the right sorting criteria." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = { app };
