const mongoose = require("mongoose");
const Publication = new mongoose.Schema({
  Created_date: {
    type: Date,
    default: Date.now(),
  },
  content: String,
  title: String,
  image: String,
});

module.exports = mongoose.model("Publication", Publication);
