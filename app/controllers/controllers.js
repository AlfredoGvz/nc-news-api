function getTopics(req, res) {
  console.log("I am a controller");
  res.status(200).send({ msg: "hello" });
}

module.exports = { getTopics };
