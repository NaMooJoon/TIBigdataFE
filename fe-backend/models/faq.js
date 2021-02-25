const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const conn = require("../connection/boardConn");
autoIncrement.initialize(conn);

const faqDocSchema = new Schema({
  docId: Number,
  userName: String,
  userEmail: String,
  title: String,
  content: String,
  category: String,
});

faqDocSchema.index({ title: "text", content: "text" });

faqDocSchema.plugin(autoIncrement.plugin, {
  model: "faqModel",
  field: "docId",
  startAt: 1,
  increment: 1,
});

module.exports = conn.model("faq", faqDocSchema);
