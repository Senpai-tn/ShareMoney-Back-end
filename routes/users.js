var express = require("express");
var router = express.Router();
var User = require("../Models/User");
var multer = require("multer");
var imageURI = "";
console.clear();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    imageURI = file.originalname;
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", async (req, res, next) => {
  var users = await User.find();
  res.json(users);
});

// truncate users
router.get("/truncate", async (req, res, next) => {
  await User.remove({});
  res.send("truncated");
});

// Register
router.post("/", async (req, res, next) => {
  const userData = JSON.parse(req.body.user);
  var user = new User(userData);
  user.photos.push(imageURI);
  var saved = await user.save();
  res.json(saved);
});

// Login
router.post("/login", async (req, res, next) => {
  var user = await User.findOne({ email: req.body.email });
  console.log("====================================");
  console.log(req.body.email + "   " + req.body.password);
  console.log("====================================");
  if (user == null) {
    res.send("404");
  } else {
    if (user.password != req.body.password) {
      res.send("400");
    } else res.json(user);
  }
});

// Get an user by _id
router.post("/getUser", async (req, res, next) => {
  var user = await User.findOne({ _id: req.body._id });
  res.json(user);
});

// Add charity to the user collection
router.post("/charity", async (req, res, next) => {
  var user = await User.findOne({ _id: "604a832a64e90b26a0443b80" });
  var t = JSON.parse(req.body.t);
  user.charity += t.price;
  const saved = await user.save();
  res.json(saved);
});

module.exports = router;
