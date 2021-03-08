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
  setTimeout(() => {
    res.json(users);
  }, 5000);
});

router.get("/truncate", async (req, res, next) => {
  await User.remove({});
  res.send("truncated");
});

router.post("/", upload.single("profile"), async (req, res, next) => {
  const userData = JSON.parse(req.body.user);
  var user = new User(userData);
  user.photos.push(imageURI);
  var saved = await user.save();
  res.json(saved);
});

router.post("/login", asy