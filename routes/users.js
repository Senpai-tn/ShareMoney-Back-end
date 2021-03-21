var express = require("express");
var router = express.Router();
var User = require("../Models/User");
var multer = require("multer");
var imageURI = "";
console.clear();
var jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    var d = new Date();
    imageURI = d.getTime() + file.originalname;
    cb(null, imageURI);
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

/** http://localhost:3000/users/login
 * {"email" :"fouzai.alaa@gmail.com",
 "password" :"12345678"}
 * */
router.post("/login", async (req, res) => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const NewUser = await User.find({ email: req.body.email }).limit(1);
    console.log(NewUser.length);
    //await sleep(2000);
    if (NewUser.length < 1) {
      await res.json({ status: "err", message: "Email Does not Exists" });
      return;
    }
    /*
    if (bcrypt.compareSync(NewUser[0].password, req.body.password))
    {

      await res.json({status:"err" , message: 'Wrong Paswword'});
      return ;
    }*/
    if (NewUser[0].password != req.body.password) {
      await res.json({ status: "err", message: "Wrong Paswword" });
      return;
    }
    if (NewUser[0].enabled === 0) {
      await res.json({ status: "err", message: "User is Disabled" });
      return;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    var payload = {
      id: NewUser[0]._id,
    };
    let token = jwt.sign(payload, process.env.token_Key);
    res.json({
      status: "ok",
      message: "Welcome Back",
      UserData: NewUser[0], //return the object not the array
      jwttoken: token,
    });
  } catch (err) {
    res.header("Access-Control-Allow-Headers", "*");
    res.json({ message: err.message });
  }
});
/*
http://localhost:3000/users/register
* 
profile:{
  
},
user : {
    "FirstName" : "alaa",
    "LastName" :"fouzai",
    "email" :"fouzai.alaa@gmail.com",
    "password" :"12345678",
    "phone":123456,
    "username":"fouzai alaa"
  }
*
* */
router.post("/register", upload.single("profile"), async (req, res) => {
  console.log(req.body);
  const userData = JSON.parse(req.body.user);
  let user = new User({
    FirstName: userData.FirstName,
    LastName: userData.LastName,
    email: userData.email,
    password: userData.password,
    enabled: true,
    phone: userData.phone,
    username: userData.username,
  });
  try {
    const NewUser = await User.find({ email: userData.email });
    if (NewUser === undefined || NewUser.length == 0) {
      //var salt = bcrypt.genSaltSync(10);
      user.password = req.body.password; // bcrypt.hashSync(user.password, salt);
      user.role.push("user");
      user.photos.push(imageURI);
      user = await user.save();
      res.json({ status: "ok", message: "Account Create ! You can now Login" });
      console.log("new user created");
      return;
    }
    console.log("hello");
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json({ status: "err", message: "Email Already Exists" });
  } catch (err) {
    //res.header("Access-Control-Allow-Headers", "*");
    res.json({ message: err.message });
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
