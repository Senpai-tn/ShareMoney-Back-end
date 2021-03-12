const mongoose = require("mongoose");
const Admin = new mongoose.Schema({
  month: String,
  numberUser: Number,
  charity: Number,
});

module.exports = mongoose.model("Admin", Admin);
