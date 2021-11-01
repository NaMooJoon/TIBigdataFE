const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  topic: String,
  hashKey: String,
  docTitle: String,
});

const conn = require("../connection/dataConn");
module.exports = conn.model("topics", topicSchema);
