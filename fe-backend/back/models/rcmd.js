const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rcmdSchema = new Schema({
  docID: String,
  rcmd: [],
  lastUpdate: Date,
});
const conn = require("../connection/dataConn");
module.exports = conn.model("rcmd", rcmdSchema);
