const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  topic: String,
  docID: String,
  docTitle: String,
  lastUpdate: Date,
});
const conn = require("../connection/dataConn");
module.exports = conn.model("topics", topicSchema);
