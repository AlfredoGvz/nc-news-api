exports.handle400s = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Not found" });
  }
};

// exports.handle500s = (err, req, res, next) => {};
