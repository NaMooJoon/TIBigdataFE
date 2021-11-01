const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const srchHstSchema = new Schema({
  keyword: String,
  year: Number,
  month: Number,
  date: Number,
  hour: Number,
  min: Number,
  time: Date,
});

// module.exports = mongoose.model('history',srchHstSchema);
// module.exports = srchHstSchema;
const conn = require("../connection/userConn");
module.exports = conn.model("history", srchHstSchema);
