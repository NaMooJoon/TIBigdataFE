const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tfidfSchema = new Schema({
  hash_key: String,
  docTitle: String,
  tfidf: [],
  lastUpdate: Date,
});

const conn = require("../connection/dataConn");
module.exports = conn.model("tfidf", tfidfSchema);
