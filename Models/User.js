const mongoose = require("mongoose");
const User = new mongoose.Schema({
  email: String,
  location: Array,
  products: Array,
  password: String,
  establishement: Array,
  photos: Array,
  birthdate: Date,
  role: String,
  createdAt: Date,
  phone: String,
  username: String,
  expo_id: String,
  transactions: Array,
  charity: Number,
});

module.exports = mongoose.model("User", User);
