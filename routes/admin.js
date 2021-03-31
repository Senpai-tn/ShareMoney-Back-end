var express = require("express");
var router = express.Router();
var Admin = require("../Models/Admin");
console.clear();

// Add charity to the total of the month
router.post("/", async (req, res, next) => {
  const adminData = req.body.admin;
  var a = new Admin(adminData);
  var d = new Date();
  const old = await Admin.findOne({
    month: d.getFullYear() + "-" + (d.getUTCMonth() + 1),
  });

  if (old != null) {
    old.charity += a.charity;
    old.numberUser += 1;
    var saved = await old.save();
    res.json(saved);
  } else {
    a.month = d.getFullYear() + "-" + (d.getUTCMonth() + 1);
    var saved = await a.save();
    res.json(saved);
  }
});

router.get("/", async (req, res, next) => {
  const all = await Admin.find();
  let s = 0;
  all.map((item, k) => {
    s += item.charity;
  });
  const log = {
    total: s,
    months: all,
  };
  res.json(log);
});

router.get("/valid", async (req, res, next) => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setUTCMilliseconds(0);
  const admins = await Admin.find({ month: { $lt: d.getTime() } });
  let s = 0;
  admins.map((item, k) => {
    s += item.charity;
  });
  const log = {
    total: s,
    months: admins,
  };

  res.json(log);
});

module.exports = router;
