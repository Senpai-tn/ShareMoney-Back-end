const mongoose = require("mongoose");
const User = new mongoose.Schema({
  email: String,
  FirstName: {
    type : String,
    required : true
  },
  LastName: {
    type : String,
    required : true
  },
  products: [],
  password: String,
  enabled: {
    type : Number,
    required : true
  },
  Created_date: {
    type : Date,
    default : Date.now()
  },
  establishement: [mongoose.Schema.Types.ObjectId],
  photos: [],
  birthdate: Date,
  role: [],
  phone: String,
  username: String,
  expo_id: String,
  transactions: [mongoose.Schema.Types.ObjectId],
  charity: [],
});

module.exports = mongoose.model("User", User);
