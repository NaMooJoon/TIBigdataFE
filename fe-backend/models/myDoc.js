const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const keywordListSchema = new Schema({
  keyword : String,
  savedDate : Date,
  savedDocHashKeys: [],
});

const keepDocSchema = new Schema({
  userEmail: String,
  keywordList : [keywordListSchema],
});

// module.exports = mongoose.model('keepDoc',keepDocSchema);
// module.exports = keepDocSchema;
const conn = require("../connection/userConn");
module.exports = conn.model("myDoc", keepDocSchema);
