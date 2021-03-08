var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Location = require("../Models/Location");
router.get("/", async (req, res, next) => {
  var locations = await Location.find();
  res.json(locations);
});

router.post("/", async (req, res, next) => {
  const u = new Location({
    latitude: 30,
    longitude: 15,
  });
  try {
    const saved = await u.save();
    res.json(saved);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/truncate", async (req, res, next) => {
  await Location.deleteMany();
  res.send("truncated");
});

module.exports = router;
