var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Location = require("../Models/Location");
const User = require("../Models/User");

/* GET Locations listing. */
router.get("/", async (req, res, next) => {
  var locations = await Location.find();
  /*var d = new Date("2021-03-20");
  var d1 = new Date(1584662400000);
  console.log(d.getTime() + "  " + d1);*/
  res.json(locations);
});

router.post("/", async (req, res, next) => {
  var distance = parseFloat(req.body.distance);
  var locations = await Location.find({
    longitude: {
      $gt: req.body.position.longitude - distance,
      $lt: req.body.position.longitude + distance,
    },
    latitude: {
      $gt: req.body.position.latitude - distance,
      $lt: req.body.position.latitude + distance,
    },
  });
  res.json(locations);
});

router.post("/add", async (req, res, next) => {
  const list = req.body.locations;
  var user = await User.findOne({ _id: req.body.id_user });
  var a = user.establishement;
  list.map(async (item, index) => {
    let L = new Location(item);
    let locationObject = await L.save();
    a.push(locationObject);
  });
  setTimeout(async () => {
    user.establishement = a;
    console.log(user.establishement.length + "  " + req.body.locations.length);
    user.phone = "00110011";
    var u = await user.save();
    res.json({
      status: "ok",
      message: "Account Create ! You can now Login",
      userdata: u,
    });
  }, 2000);
});

router.get("/truncate", async (req, res, next) => {
  await Location.deleteMany();
  res.send("truncated");
});

module.exports = router;
