const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tfidfSchema = new Schema({
  docID: String,
  docTitle: String,
  tfidf: [],
  lastUpdate: Date,
});

const conn = require("../connection/dataConn");
module.exports = conn.model("tfidf", tfidfSchema);
