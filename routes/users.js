var express = require("express");
var router = express.Router();
var User = require("../Models/User");
var multer = require("multer");
var imageURI = "";
console.clear();
var jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

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
data json from the front as formdata
profile : {
    "_parts": Array [
    Array [
      "profile",
      Object {
        "name": "54992d4e-a48a-4b23-9599-0399c9508742.jpg",
        "type": "image/jpeg",
        "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540senpaitn%252FShareMoney/ImagePicker/54992d4e-a48a-4b23-9599-0399c9508742.jpg",
      },
    ],
    Array [
      "user",
      "{\"email\":\"M\",\"password\":\"M\",\"products\":[],\"establishement\":[],\"photos\":[],\"birthdate\":\"2021-03-21T19:50:06.121Z\",\"role\":[\"seller\"],\"createdAt\":\"2021-03-21T19:50:32.887Z\",\"phone\":\"00\",\"username\":\"\",\"expo_id\":\"\",\"charity\":0,\"duty\":0,\"FirstName\":\"M\",\"enabled\":1,\"LastName\":\"M\",\"transactions\":[]}",
    ],
  ],
}
}
* */
router.post("/register", upload.single("profile"), async (req, res) => {
  console.log(req.body.user);
  const userData = JSON.parse(req.body.user);

  let user = new User(userData);
  try {
    const NewUser = await User.find({ email: userData.email });
    if (NewUser === undefined || NewUser.length == 0) {
      user.photos.push(imageURI);
      user = await user.save();
      res.json({
        status: "ok",
        message: "Account Create ! You can now Login",
        userdata: user,
      });
      console.log(JSON.stringify(user));
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

router.post("/update", upload.single("profile"), async (req, res, next) => {
  //console.log(req.body);
  const user = JSON.parse(req.body.user);
  const newUser = await User.findOne({ _id: user._id });
  newUser.overwrite(user);
  if (imageURI != "") newUser.photos.unshift(imageURI);
  const newData = await newUser.save();
  if (newData != null) {
    res.json({
      status: "ok",
      message: "Account Create ! You can now Login",
      userdata: newData,
    });
  } else res.json({ status: "err", message: "Email Already Exists" });
});

// Add charity to the user collection
router.post("/charity", async (req, res, next) => {
  var user = await User.findOne({ _id: req.body.user._id });
  var seller = await User.findOne({ _id: req.body.id_seller });
  var charity = JSON.parse(req.body.charity);
  user.charity += charity - charity / 10;
  seller.duty += charity;
  await seller.save();
  const savedUser = await user.save();
  var d = new Date();
  var a = new Admin();
  d.setDate(1);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setUTCMilliseconds(0);

  a.month = d.getTime();
  console.log(a.month);
  a.numberUser = 0;
  a.charity = charity;
  const old = await Admin.findOne({
    month: d.getTime(),
  });
  if (old != null) {
    old.charity += a.charity;
    old.numberUser += 1;
    await old.save();
  } else {
    a.month = d.getTime();
    a.numberUser = 1;
    await a.save();
  }
  console.log(savedUser.duty);
  res.json(savedUser);
});

module.exports = router;
