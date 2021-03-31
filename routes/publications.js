var express = require("express");
const Publication = require("../Models/Publication");
var router = express.Router();

router.get("/", async (req, res, next) => {
  const pubs = await Publication.find();
  console.log(pubs);
  res.json(pubs);
});

module.exports = router;
