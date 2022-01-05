const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const conn = require("../connection/boardConn");
autoIncrement.initialize(conn);

const qnaDocSchema = new Schema({
  docId: Number,
  userName: String,
  userEmail: String,
  title: String,
  content: String,
  regDate: Date,
  modDate: Date,
  isAnswered: Boolean,
  reply: {
    userName: String,
    userEmail: String,
    title: String,
    content: String,
    regDate: Date,
    modDate: Date,
  },
});

qnaDocSchema.index({ title: "text", content: "text" });

qnaDocSchema.plugin(autoIncrement.plugin, {
  model: "qnaModel",
  field: "docId",
  startAt: 1,
  increment: 1,
});

module.exports = conn.model("qna", qnaDocSchema);
